

import React, { useRef, useState, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Send, Image as ImageIcon, Loader2, StarsIcon, X, Plus, Menu, EllipsisVertical } from 'lucide-react';
import DownloadButton from '../components/DownloadButton';
import useDownloadStore from '../store/downloadStore';
import useChatbotChatStore from '../store/chatbotChatStore';
import useChatbotComponentStore from '../store/chatbotComponentStore';
import { generateComponentWithGemini } from '../utils/geminiApi';
// Lazy-load heavy subcomponents to reduce initial render cost
const DynamicPreview = lazy(() => import('../components/DynamicPreview'));
const MessageList = lazy(() => import('../components/chatbot/MessageList'));
const CodePanel = lazy(() => import('../components/chatbot/CodePanel'));
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable';
import {
    listConversations,
    createConversation,
    listMessagesByConversation,
    createMessage,
} from '../utils/api';
import useAuthStore from '../store/authStore';
import {
    parseGeminiResponse,
    toBase64,
    formatSelectedElementLabel,
    useAbortController,
    usePromptText,
    useComponentCount,
    useProcessedMessages
} from '../utils/chatbotUtils';



const ChatbotAIEditor = memo(() => {
    const navigate = useNavigate();
    const { id: routeConversationId } = useParams();
    const { logout } = useAuthStore();
    const {
        messages,
        addMessage,
        clearMessages,
        setMessages,
    } = useChatbotChatStore();

    const {
        addComponent,
        updateComponent,
        setCurrentComponent,
        clearComponents,
        clearError: clearComponentError,
        editMode,
        selectedElement,
        setEditMode,
        clearSelectedElement,
        editModeError,
        isElementSelectionValid,
        validateSelectedElement,
        components,
    } = useChatbotComponentStore();

    // Race condition protection
    const { createAbortController } = useAbortController();

    const [code, setCode] = useState({ jsx: '', css: '' });
    const setDownloadCode = useDownloadStore((s) => s.setCode);
    const clearCode = useDownloadStore((s) => s.clearCode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('preview');
    const [userPrompt, setUserPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [initializing, setInitializing] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);

    const fileInputRef = useRef(null);
  
    // Memoized values
    const processedMessages = useProcessedMessages(messages);
    const componentCount = useComponentCount(components);
    const promptText = usePromptText(userPrompt, code, selectedElement, editMode, isElementSelectionValid);

    // Scroll handler is now handled by MessageList component

    useEffect(() => {
        setError('');
        clearComponentError();
    }, [clearComponentError]);

    // Initialize and re-run when route conversation changes
    useEffect(() => {
        const abortController = createAbortController();

        const initSessionAndConversation = async () => {
            try {
                setInitializing(true);
                // // console.log('🚀 [Session Init] Starting initialization...');

                // Load conversations and pick the latest active one or create new
                // // console.log('💬 [Conversation Init] Loading conversations...');
                const convs = await listConversations();

                if (abortController.signal.aborted) return;

                // // console.log('📊 [Conversation Init] Found conversations:', convs?.length || 0);

                let conv = null;
                if (routeConversationId) {
                    conv = Array.isArray(convs) ? convs.find(c => c.id === routeConversationId) : null;
                }
                if (!conv) {
                    try {
                        const lastId = localStorage.getItem('lastConversationId');
                        if (lastId) {
                            conv = Array.isArray(convs) ? convs.find(c => c.id === lastId) : null;
                            if (conv && routeConversationId !== lastId) {
                                navigate(`/chat/${lastId}`, { replace: true });
                            }
                        }
                    } catch {
                        // ignore storage errors
                    }
                }
                if (!conv) {
                    conv = Array.isArray(convs) ? [...convs].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).find(c => c.isActive) : null;
                }
                if (!conv) {
                    // // console.log('🆕 [Conversation Init] No active conversation, creating new...');
                    conv = await createConversation({ title: 'untitled' });

                    if (abortController.signal.aborted) return;

                    // // console.log('✅ [Conversation Init] New conversation created:', conv.id);
                } else {
                    // // console.log('♻️ [Conversation Init] Using existing conversation:', conv.id);
                }

                // Store conversation ID in state for persistence
                setConversationId(conv.id);
                try { localStorage.setItem('lastConversationId', conv.id); } catch {
                    // 
                }
                if (routeConversationId && routeConversationId !== conv.id) {
                    navigate(`/chat/${conv.id}`, { replace: true });
                }

                // Load messages for conversation
                // // console.log('📨 [Messages Init] Loading messages for conversation:', conv.id);
                const res = await listMessagesByConversation(conv.id);

                if (abortController.signal.aborted) return;

                const items = res?.items || res || [];
                // // console.log('📊 [Messages Init] Found messages:', items.length);

                // Rebuild message list and current component from backend
                const frontendMsgs = items
                    .slice()
                    .reverse()
                    .map(m => {
                        const isUser = m.role === 'user';
                        const text = m.data?.text || m.data?.responseText || '';
                        return {
                            id: m.id,
                            type: isUser ? 'prompt' : 'response',
                            text,
                            conversationId: conv.id,
                            component: m.data?.component || null,
                        };
                    });

                if (abortController.signal.aborted) return;

                setMessages(frontendMsgs);
                // // console.log('✅ [Messages Init] Messages loaded:', frontendMsgs.length);

                // Restore latest JSX/CSS component if present, else clear
                // Prefer details endpoint if available to load components; fallback to last assistant JSX component in messages
                let newCode = { jsx: '', css: '' };
                try {
                    const details = await import('../utils/api').then(m => m.getConversationDetails(conv.id, { messagesLimit: 200 }));
                    const comps = details?.components || details?.data?.components || [];
                    const latest = comps[0];
                    if (latest?.data?.jsx || latest?.data?.css) {
                        newCode = { jsx: latest.data.jsx || '', css: latest.data.css || '' };
                    } else {
                        const latestAssistantWithComponent = items.find(m => m.role === 'ai' && (m.type === 'jsx' || m.data?.component?.jsx));
                        const latestComponent = latestAssistantWithComponent?.data?.component;
                        newCode = { jsx: latestComponent?.jsx || '', css: latestComponent?.css || '' };
                    }
                } catch {
                    const latestAssistantWithComponent = items.find(m => m.role === 'ai' && (m.type === 'jsx' || m.data?.component?.jsx));
                    const latestComponent = latestAssistantWithComponent?.data?.component;
                    newCode = { jsx: latestComponent?.jsx || '', css: latestComponent?.css || '' };
                }
                setCode(newCode);
                setDownloadCode(newCode);
                // // console.log('🎨 [Component Init] Component set from conversation');

                // // console.log('🎉 [Session Init] Initialization complete!');
                setIsDataReady(true);
            } catch (e) {
                if (e.name === 'AbortError') {
                    // // console.log('🚫 [Session Init] Initialization cancelled');
                    return;
                }
                // Non-fatal; allow local-only flow
                // // console.error('❌ [Session Init] Initialization failed:', e);
                // If unauthorized, clear auth and redirect
                const status = e?.response?.status || e?.status;
                if (status === 401 || status === 403) {
                    logout();
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('sessionId');
                    navigate('/login', { replace: true });
                    return;
                }
                // For other errors, stop blocking UI to avoid infinite loader
                setIsDataReady(true);
            } finally {
                setInitializing(false);
            }
        };

        initSessionAndConversation();

        return () => {
            abortController.abort();
        };
    }, [setMessages, createAbortController, navigate, logout, setDownloadCode, routeConversationId]);

    const handleSend = useCallback(async () => {
        if (!userPrompt.trim() && !image) return;

        if (editMode && !selectedElement) {
            setError('Select an element in Edit Mode before sending.');
            return;
        }
        if (editMode && selectedElement) {
            const valid = validateSelectedElement();
            if (!valid) {
                setError('Please reselect the element.');
                return;
            }
        }

        setLoading(true);
        setError('');

        const abortController = createAbortController();
        const localConversationId = conversationId || `chatbot_${Date.now()}`;

        const promptMsg = {
            type: 'prompt',
            text: userPrompt,
            image: image || null,
            conversationId: localConversationId,
            selectedTarget: editMode && selectedElement ? formatSelectedElementLabel(selectedElement) : null,
        };

        try {
            // // console.log('💬 [Message Send] Starting message send process...');

            // Local add first for snappy UI
            addMessage(promptMsg);
            // // console.log('⚡ [Message Send] Message added to local state');

            // Persist user message to backend if conversation exists
            if (conversationId) {
                // // console.log('💾 [Message Send] Persisting user message to backend...');
                const userPayload = {
                    conversationId,
                    role: 'user',
                    type: 'text',
                    data: {
                        text: userPrompt,
                        image: image ? { mimeType: image.type } : null,
                        selectedTarget: promptMsg.selectedTarget,
                    },
                };
                await createMessage(userPayload);

                if (abortController.signal.aborted) return;

                // // console.log('✅ [Message Send] User message persisted to backend');
            }

            const hasExistingComponent = code.jsx && code.css;
            const isFollowUpPrompt = hasExistingComponent && messages.length > 0;
            const isTargetedEdit = editMode && selectedElement && isFollowUpPrompt && isElementSelectionValid;

            let finalPromptText = promptText;
            let imagePart = [];

            if (image) {
                finalPromptText += '\n[Image attached]';
                imagePart = [
                    { inlineData: { mimeType: image.type, data: await toBase64(image) } },
                ];
            }

            // // console.log('🤖 [AI Generation] Calling Gemini API...');

            const output = await generateComponentWithGemini(finalPromptText, imagePart, isFollowUpPrompt);

            if (abortController.signal.aborted) return;

            // // console.log('✅ [AI Generation] Response received from Gemini');

            const responseMsg = {
                id: Date.now(),
                type: 'response',
                text: output,
                conversationId: localConversationId,
            };
            addMessage(responseMsg);
            // // console.log('⚡ [AI Response] Response added to local state');

            const parsed = parseGeminiResponse(output);
            // // console.log('🔍 [Component Parse] Parsed JSX:', !!parsed.jsx, 'CSS:', !!parsed.css);
            setCode(parsed);
            setDownloadCode(parsed);

            if (parsed.jsx && parsed.css) {
                // // console.log('🎨 [Component Save] Saving component to local store...');
                const componentData = {
                    name: isFollowUpPrompt ? 'ModifiedAIComponent' : 'AIComponent',
                    jsxCode: parsed.jsx,
                    cssCode: parsed.css,
                    componentType: isTargetedEdit ? 'targeted-edit' : (isFollowUpPrompt ? 'modified' : 'generated'),
                    metadata: {
                        conversationId: localConversationId,
                        generatedFrom: responseMsg.id,
                        isFollowUpPrompt,
                        isTargetedEdit,
                        selectedElement: isTargetedEdit ? {
                            tagName: selectedElement.tagName,
                            className: selectedElement.className,
                            id: selectedElement.id,
                            path: selectedElement.path,
                        } : null,
                        previousComponentExists: hasExistingComponent,
                        modificationPrompt: isFollowUpPrompt ? userPrompt : null,
                    },
                };

                if (hasExistingComponent) {
                    const current = components.find(c => c.isCurrent) || components[components.length - 1];
                    if (current) {
                        updateComponent(current.id, {
                            jsxCode: componentData.jsxCode,
                            cssCode: componentData.cssCode,
                            componentType: componentData.componentType,
                            metadata: { ...current.metadata, ...componentData.metadata },
                            isCurrent: true,
                        });
                        setCurrentComponent({ ...current, ...componentData, isCurrent: true });
                        // // console.log('✅ [Component Update] Existing component updated');
                    } else {
                        addComponent({ ...componentData, isCurrent: true });
                        // // console.log('✅ [Component Save] No current component; added new');
                    }
                } else {
                    addComponent({ ...componentData, isCurrent: true });
                    // // console.log('✅ [Component Save] Component saved to local store');
                }
            }

            // Persist AI message with JSX/CSS to backend
            if (conversationId) {
                // // console.log('💾 [AI Persistence] Persisting AI response to backend...');
                const aiPayload = {
                    conversationId,
                    role: 'ai',
                    type: parsed.jsx || parsed.css ? 'jsx' : 'text',
                    data: parsed.jsx || parsed.css ? {
                        text: output,
                        component: { jsx: parsed.jsx, css: parsed.css },
                        isEdited: false,
                    } : { text: output },
                };
                await createMessage(aiPayload);

                if (abortController.signal.aborted) return;

                // // console.log('✅ [AI Persistence] AI response persisted to backend');
            }

            // // console.log('🎉 [Message Send] Complete!');

        } catch (error) {
            if (error.name === 'AbortError') {
                // // console.log('🚫 [Message Send] Request cancelled');
                return;
            }
            setError('Error generating component. Please try again.');
            addMessage({ type: 'response', text: 'Error generating component. Please try again.' });
        } finally {
            setLoading(false);
            setUserPrompt('');
            setImage(null);
        }
    }, [userPrompt, image, editMode, selectedElement, validateSelectedElement, conversationId, addMessage, code, messages, isElementSelectionValid, addComponent, createAbortController, promptText, components, setCurrentComponent, updateComponent, setDownloadCode]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const handleRestoreFromMessage = useCallback((message) => {
        if (message?.component?.jsx) {
            setCode({ jsx: message.component.jsx || '', css: message.component.css || '' });
            return;
        }
        const { restoreComponentFromMessage } = useChatbotComponentStore.getState();
        const restoredComponent = restoreComponentFromMessage(message?.id);
        if (restoredComponent) {
            setCode({ jsx: restoredComponent.jsxCode, css: restoredComponent.cssCode });
        }
    }, []);

    const handleNewChat = useCallback(async () => {
        try {
            setShowScrollButton(false);
            setEditMode(false);
            clearSelectedElement();
            clearMessages();
            clearComponents();
            setCode({ jsx: '', css: '' });
            setError('');
            clearCode();
            const newConv = await createConversation({ title: 'New Chat' });
            setConversationId(newConv.id);
            try { localStorage.setItem('lastConversationId', newConv.id); } catch {
                // 
            }
            navigate(`/chat/${newConv.id}`);
        } catch (e) {
        console.log("failed to start new chat ",e);
            setError('Failed to start new chat');
        }
    }, [setEditMode, clearSelectedElement, clearMessages, clearComponents, clearCode, navigate]);

    // Download handled by Zustand store

    if (initializing || !isDataReady) {
        return (
             <div className="min-h-screen bg-[#1B1B1B] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-12 h-12 mx-auto border-2 border-gray-800 border-t-white rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-300 text-sm font-light">Preparing your workspace...</p>
      </div>
    </div>
        );
    }

    return (
        <div className="min-h-screen  font-inter ">
            <div className=" mx-auto  h-screen">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={35}  className="bg-[#1B1B1B] rounded-l-sm shadow-xl flex flex-col item-center justify-between overflow-hidden">
                        {/* Header */}
                       <div className="flex  justify-end items-center p-3 shadow-md ">
                            <div className="flex  w-full items-center justify-between gap-2">
                                <button
                                    onClick={handleNewChat}
                                    className="flex text-semibold items-center gap-1 hover:bg-[#2d2d2e] cursor-pointer  text-gray-300 hover:text-gray-200  px-2 py-1.5 rounded-lg transition-colors text-sm"
                                    title="New Chat"
                                >
                                    <Plus className="w-4 h-4" />
                                    New 
                                </button>
                                <div className="flex items-center gap-2">
  {code.jsx && code.css && (
    <div className="bg-[#2d2d2e] text-gray-300 rounded-md px-2 py-0.5 text-xs font-medium flex items-center">
      v{componentCount}
    </div>
  )}
  <EllipsisVertical className="h-5 w-5 text-gray-300 cursor-pointer " />
</div>


                               
                               
                            </div>
                        </div>

                        {/* Messages */}
                        <Suspense fallback={<div className="p-6  text-slate-400">Loading messages...</div>}>
                            <MessageList
                                messages={processedMessages}
                                loading={loading}
                                error={error}
                                editModeError={editModeError}
                                showScrollButton={showScrollButton}
                                onRestoreFromMessage={handleRestoreFromMessage}
                                code={code}
                                editMode={editMode}
                                selectedElement={selectedElement}
                            />
                        </Suspense>

                        {/* Input Area */}
                        <div className="px-6 pb-6 pt-4  backdrop-blur-sm ">
                            {selectedElement && isElementSelectionValid ? (
                                <div className="mb-3 px-3 py-1.5 bg-[#334155] border border-[#475569] rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-wrap text-xs">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span className="font-mono text-[#ec5757]">Target:</span>
                                            <span className="font-mono text-[#FFFFFF] bg-gray-700 px-2 py-1 rounded text-xs">
                                                {formatSelectedElementLabel(selectedElement)}
                                            </span>
                                            <span className="text-[#FFFFFF] bg-gray-700 font-mono px-2 py-1 rounded text-xs">
                                                {editMode ? 'Edit Mode' : 'Persistent'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={clearSelectedElement}
                                            className="  text-gray-400   p-1   rounded   transition-colors   hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20"
                                            title="Clear selected element"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            <div className="flex gap-3 items-center">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pr-12 bg-[#1A1A1A] border border-gray-700 rounded-lg text-sm text-white placeholder-[#9CA3AF] focus:outline-none   transition-all shadow-lg"
                                        placeholder={
                                            editMode && selectedElement
                                                ? `Modify the selected ${selectedElement.tagName} element...`
                                                : editMode
                                                    ? 'Select an element in the preview to target...'
                                                    : 'Describe your component...'
                                        }
                                        value={userPrompt}
                                        onChange={(e) => setUserPrompt(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={loading}
                                    />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setImage(e.target.files[0]);
                                            }
                                        }}
                                        disabled={loading}
                                    />

                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 p-2 rounded-xl transition-all duration-200 backdrop-blur-sm hover:shadow-md"
                                       
                                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                        disabled={loading}
                                        title="Attach image"
                                    >
                                        <ImageIcon size={18} />
                                    </button>
                                </div>

                                <button
                                    className=" bg-blue-500   disabled:from-slate-400 disabled:to-slate-400 text-white p-3 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-100 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                    onClick={handleSend}
                                    disabled={
                                        loading || (!userPrompt.trim() && !image) || (editMode && !selectedElement)
                                    }
                                    title={
                                        editMode && !selectedElement ? 'Select an element to target' : 'Send'
                                    }
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-[#2A2A2A] after:bg-[#2A2A2A]" />
                    {/* Preview/Code Panel */}
                    <ResizablePanel defaultSize={65}  className="bg-[#222222] rounded-r-sm shadow-xl flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-2 shadow-xl">
                            <div className="flex bg-[#0F0F0F] rounded-lg p-1 shadow-lg">
                                <button
                                    className={`px-3 py-1.5 text-sm rounded  transition-all ease-in-out ${activeTab === 'preview'
                                        ? 'bg-[#323333] text-[#FFFFFF] shadow-md'
                                        : 'text-gray-300 '
                                        }`}
                                    onClick={() => setActiveTab('preview')}
                                >
                                    Preview
                                    {code.jsx && code.css && componentCount > 1 && (
                                        <span className="ml-2 bg-blue-600 text-white px-1 py-0.5 rounded text-xs">
                                            Modified
                                        </span>
                                    )}
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded transition-all ease-in-out ${activeTab === 'code'
                                        ? 'bg-[#37383a] text-[#FFFFFF] shadow-md'
                                        : 'text-gray-300'
                                        }`}
                                    onClick={() => setActiveTab('code')}
                                >
                                    Code
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <DownloadButton />
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Edit </span>
                                    <button
  onClick={() => setEditMode(!editMode)}
  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shadow-sm 
    ${editMode ? 'bg-cyan-500/80' : 'bg-gray-600/60'}`}
  title={editMode ? 'Disable edit mode' : 'Enable edit mode'}
>
  <span
    className={`inline-block h-3 w-3 transform rounded-full bg-gray-100 transition-transform 
      ${editMode ? 'translate-x-5' : 'translate-x-1'}`}
  />
</button>

                                </div>
                                {selectedElement && (
                                    <button
                                        onClick={clearSelectedElement}
                                        className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-1.5 rounded transition-colors shadow-sm"
                                        title="Clear selection"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            {activeTab === 'preview' ? (
                                <div className="h-full ">
                                    {code.jsx ? (
                                        <div className="h-full   overflow-auto">
                                            <Suspense fallback={<div className="p-6 text-slate-500">Loading preview...</div>}>
                                                <DynamicPreview jsx={code.jsx} css={code.css} />
                                            </Suspense>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-white/50">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-slate-200/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <StarsIcon className="w-8 h-8 text-white/50" />
                                                </div>
                                                <p className="text-lg font-medium">No component generated yet</p>
                                                <p className="text-sm mt-2">Start by describing your component in the chat</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Suspense fallback={<div className="p-6 text-slate-500">Loading code...</div>}>
                                    <CodePanel code={code} />
                                </Suspense>
                            )}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
});

ChatbotAIEditor.displayName = 'ChatbotAIEditor';

export default ChatbotAIEditor;


