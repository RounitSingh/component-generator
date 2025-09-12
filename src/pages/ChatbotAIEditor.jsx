

import React, { useRef, useState, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon, Loader2, StarsIcon, X, Plus } from 'lucide-react';
import useChatbotChatStore from '../store/chatbotChatStore';
import useChatbotComponentStore from '../store/chatbotComponentStore';
import { generateComponentWithGemini } from '../utils/geminiApi';
// Lazy-load heavy subcomponents to reduce initial render cost
const DynamicPreview = lazy(() => import('../components/DynamicPreview'));
const MessageList = lazy(() => import('../components/chatbot/MessageList'));
const CodePanel = lazy(() => import('../components/chatbot/CodePanel'));
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('preview');
    const [userPrompt, setUserPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [initializing, setInitializing] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(true);
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

    // Initialize: ensure session, pick/create conversation, load messages
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
                
                let conv = Array.isArray(convs) ? [...convs].sort((a,b) => new Date(b.updatedAt||0) - new Date(a.updatedAt||0)).find(c => c.isActive) : null;
                if (!conv) {
                    // // console.log('🆕 [Conversation Init] No active conversation, creating new...');
                    conv = await createConversation({ title: 'ChatbotAIEditor Conversation' });
                    
                    if (abortController.signal.aborted) return;
                    
                    // // console.log('✅ [Conversation Init] New conversation created:', conv.id);
                } else {
                    // // console.log('♻️ [Conversation Init] Using existing conversation:', conv.id);
                }
                
                // Store conversation ID in state for persistence
                setConversationId(conv.id);
                
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
                const latestAssistantWithComponent = items.find(m => m.role === 'ai' && (m.type === 'jsx' || m.data?.component?.jsx));
                const latestComponent = latestAssistantWithComponent?.data?.component;
                setCode({ jsx: latestComponent?.jsx || '', css: latestComponent?.css || '' });
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
    }, [setMessages, createAbortController, navigate, logout]);

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
    }, [userPrompt, image, editMode, selectedElement, validateSelectedElement, conversationId, addMessage, code, messages, isElementSelectionValid, addComponent, createAbortController, promptText, components, setCurrentComponent, updateComponent]);

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

    const handleClearChat = useCallback(() => {
        setShowScrollButton(false);
        setEditMode(false);
        clearSelectedElement();
        clearMessages();
        clearComponents();
        setCode({ jsx: '', css: '' });
        setError('');
    }, [setEditMode, clearSelectedElement, clearMessages, clearComponents]);

    if (initializing || !isDataReady) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Preparing your workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter ">
            <div className="container mx-auto py-6 px-8 h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
                    {/* Chat Panel border-slate-200/60 */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/60 shadow-xl   flex flex-col item-center justify-between overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <StarsIcon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">GenUI</h1>
                                    <p className="text-blue-100 text-sm">AI Component Generator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {code.jsx && code.css && (
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
                                        v{componentCount}
                                    </div>
                                )}
                                <button
                                    onClick={handleClearChat}
                                    className="flex items-center gap-2 text-blue-50 hover:text-white hover:drop-shadow-md hover:bg-white/20 cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
                                    title="New Chat"
                                >
                                    <Plus className="w-5 h-5 rounded-full bg-white/30 text-blue-50 p-0.5 backdrop-blur-md" />
                                    New Chat
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <Suspense fallback={<div className="p-6 text-slate-500">Loading messages...</div>}>
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
                        <div className="px-6 pb-6 pt-4  backdrop-blur-sm border-t border-white/30">
                            {selectedElement && isElementSelectionValid ? (
                                <div className="mb-2 px-4 py-1.5 bg-blue-50/50 backdrop-blur-sm border border-indigo-200/60 rounded-2xl shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-wrap text-xs">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-inner"></div>
                                            <span className="font-mono  text-indigo-800">Target:</span>
                                            <span className="font-mono  text-indigo-700 bg-indigo-100/80 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                                                {formatSelectedElementLabel(selectedElement)}
                                            </span>
                                            <span className="text-indigo-600 bg-indigo-100/80  font-mono backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                                                {editMode ? 'Edit Mode' : 'Persistent'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={clearSelectedElement}
                                            className="text-indigo-600 hover:text-red-600 hover:bg-red-50/80 p-1.5 rounded-lg transition-all duration-200 hover:shadow-md backdrop-blur-sm flex-shrink-0"
                                            title="Clear selected element"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            <div className="flex gap-3 items-center">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3.5 pr-12 bg-white/80 backdrop-blur-sm border border-slate-300/50 rounded-2xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl"
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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 p-2 rounded-xl transition-all duration-200 backdrop-blur-sm hover:shadow-md"
                                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                        disabled={loading}
                                        title="Attach image"
                                    >
                                        <ImageIcon size={18} />
                                    </button>
                                </div>

                                <button
                                    className=" bg-blue-600   disabled:from-slate-400 disabled:to-slate-400 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-100 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
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
                    </div>

                    {/* Preview/Code Panel */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl border border-slate-200/60 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200/60">
                            <div className="flex bg-slate-100 rounded-2xl p-1">
                                <button
                                    className={`px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 ${activeTab === 'preview'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-slate-600 hover:text-blue-600'
                                        }`}
                                    onClick={() => setActiveTab('preview')}
                                >
                                    Preview
                                    {code.jsx && code.css && componentCount > 1 && (
                                        <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                                            Modified
                                        </span>
                                    )}
                                </button>
                                <button
                                    className={`px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 ${activeTab === 'code'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-slate-600 hover:text-blue-600'
                                        }`}
                                    onClick={() => setActiveTab('code')}
                                >
                                    Code
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-slate-700">Edit Mode</span>
                                    <button
                                        onClick={() => {
                                            setEditMode(!editMode);
                                        }}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${editMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-300'
                                            }`}
                                        title={editMode ? 'Disable edit mode' : 'Enable edit mode'}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${editMode ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                                {selectedElement && (
                                    <button
                                        onClick={clearSelectedElement}
                                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all duration-200"
                                        title="Clear selection"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            {activeTab === 'preview' ? (
                                <div className="h-full p-6">
                                    {code.jsx ? (
                                        <div className="h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-auto">
                                            <Suspense fallback={<div className="p-6 text-slate-500">Loading preview...</div>}>
                                                <DynamicPreview jsx={code.jsx} css={code.css} />
                                            </Suspense>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-slate-400">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <StarsIcon className="w-8 h-8 text-slate-400" />
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
                    </div>
                </div>
            </div>
        </div>
    );
});

ChatbotAIEditor.displayName = 'ChatbotAIEditor';

export default ChatbotAIEditor;


