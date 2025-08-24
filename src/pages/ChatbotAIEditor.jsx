        import React, { useRef, useState, useEffect } from 'react';
        import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
        import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
        import { Download, Copy, Send, Image as ImageIcon, Loader2, AlertCircle, StarsIcon } from 'lucide-react';
        import useChatbotChatStore from '../store/chatbotChatStore';
        import useChatbotComponentStore from '../store/chatbotComponentStore';
        import { generateComponentWithGemini } from '../utils/geminiApi';
        import DynamicPreview from '../components/DynamicPreview';

        const parseGeminiResponse = (text) => {
        const jsxMatch = text.match(/```(?:jsx|tsx)?([\s\S]*?)```/i);
        const cssMatch = text.match(/```css([\s\S]*?)```/i);
        return {
            jsx: jsxMatch ? jsxMatch[1].trim() : '',
            css: cssMatch ? cssMatch[1].trim() : '',
        };
        };

        const downloadFile = (filename, content) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        };

        const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Failed to copy to clipboard
        }
        };

        const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
            if (typeof reader.result === 'string') {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error('FileReader result is not a string'));
            }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        };

        const ChatbotAIEditor = () => {
        const {
            messages,
            addMessage,
            clearMessages,
        } = useChatbotChatStore();
        
        const {
            addComponent,
            clearComponents,
            clearError: clearComponentError,
        } = useChatbotComponentStore();
        
        const [code, setCode] = useState({ jsx: '', css: '' });
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
        const [activeTab, setActiveTab] = useState('preview');
        const [userPrompt, setUserPrompt] = useState('');
        const [image, setImage] = useState(null);
        const fileInputRef = useRef(null);

        // Clear errors when component mounts
        useEffect(() => {
            setError('');
            clearComponentError();
        }, [clearComponentError]);

        const handleSend = async () => {
            if (!userPrompt.trim() && !image) {return};

            setLoading(true);
            setError('');

            const conversationId = `chatbot_${Date.now()}`;

            const promptMsg = {
            type: 'prompt',
            text: userPrompt,
            image: image || null,
            conversationId,
            };

            try {
            // Add user message to local state immediately
            addMessage(promptMsg);

            // Check if this is a follow-up prompt (modifying existing component)
            const hasExistingComponent = code.jsx && code.css;
            const isFollowUpPrompt = hasExistingComponent && messages.length > 0;
            
            // Prepare AI request with context
            let promptText = userPrompt;
            let imagePart = [];
            
            if (isFollowUpPrompt) {
                // For follow-up prompts, include the current component code
                promptText = `I have an existing React component. Please modify it according to this request: "${userPrompt}"

        Current JSX code:
        \`\`\`jsx
        ${code.jsx}
        \`\`\`

        Current CSS code:
        \`\`\`css
        ${code.css}
        \`\`\`

        Please provide the complete updated component with the requested changes.`;
            }
            
            if (image) {
                promptText += '\n[Image attached]';
                imagePart = [
                {
                    inlineData: {
                    mimeType: image.type,
                    data: await toBase64(image),
                    },
                },
                ];
            }

            // Generate AI response
            const output = await generateComponentWithGemini(promptText, imagePart, isFollowUpPrompt);

            // Add AI response to local state
            const responseMsg = { 
                type: 'response', 
                text: output,
                conversationId,
            };
            addMessage(responseMsg);

            // Parse and set component code
            const parsed = parseGeminiResponse(output);
            setCode(parsed);

            // Add component to local state
            if (parsed.jsx && parsed.css) {
                const componentData = {
                name: isFollowUpPrompt ? 'ModifiedAIComponent' : 'AIComponent',
                jsxCode: parsed.jsx,
                cssCode: parsed.css,
                componentType: isFollowUpPrompt ? 'modified' : 'generated',
                metadata: {
                    conversationId,
                    isFollowUpPrompt,
                    previousComponentExists: hasExistingComponent,
                    modificationPrompt: isFollowUpPrompt ? userPrompt : null,
                },
                };

                addComponent({
                ...componentData,
                isCurrent: true,
                });
            }

            } catch {
            setError('Error generating component. Please try again.');
            addMessage({ type: 'response', text: 'Error generating component. Please try again.' });
            } finally {
            setLoading(false);
            setUserPrompt('');
            setImage(null);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
            }
        };

        //   const handleSelectVersion = (component) => {
        //     setCode({
        //       jsx: component.jsxCode,
        //       css: component.cssCode
        //     });
        //   };

        const handleRestoreFromMessage = (messageId) => {
            const { restoreComponentFromMessage } = useChatbotComponentStore.getState();
            const restoredComponent = restoreComponentFromMessage(messageId);
            
            if (restoredComponent) {
            setCode({
                jsx: restoredComponent.jsxCode,
                css: restoredComponent.cssCode
            });
            }
        };

        const handleClearChat = () => {
            clearMessages();
            clearComponents();
            setCode({ jsx: '', css: '' });
            setError('');
        };

        return (
            <div className="h-screen p-4 gap-4 grid grid-cols-1 md:grid-cols-10">
            {/* Chat Panel */}
            <div className="md:col-span-3 w-full p-6 flex flex-col rounded-2xl border-gray-200 drop-shadow-lg max-h-screen overflow-y-auto  bg-white">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl flex flex-row gap-2 font-bold text-blue-700">
                    <span className="rounded-lg bg-blue-500 p-2">
                    <StarsIcon className='h-5 w-5 text-blue-50'/>
                    </span> 
                    AI Chatbot
                </h2>
                <div className="flex items-center gap-4">
                    {code.jsx && code.css && (
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        Component v{useChatbotComponentStore.getState().components?.filter(c => c.isCurrent).length || 1}
                    </div>
                    )}
                    <button
                    onClick={handleClearChat}
                    className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100"
                    title="Clear chat"
                    >
                    Clear
                    </button>
                </div>
                </div>

                {/* Messages */}
                <div className="flex-1 h-[400px] overflow-y-auto overflow-x-hidden mb-4 space-y-3 pr-2">
                {messages.map((msg, idx) => (
                    <div key={msg.id || idx} className={`flex w-full ${msg.type === 'prompt' ? 'justify-start' : 'justify-end'}`}>
                    <div
                    className={`flex flex-col max-w-[80%] ${
                        msg.type === 'prompt' ? 'items-start' : 'items-end'
                    }`}
                    >
                        <div
                        className={`rounded-xl px-4 py-3 max-w-[80%] shadow text-sm whitespace-pre-line animate-in ${
                            msg.type === 'prompt'
                            ? 'bg-blue-100 text-gray-800'
                            : 'bg-green-100 text-gray-900'
                        }`}
                        >
                        {msg.text}
                        {msg.image && (
                            <img
                            src={URL.createObjectURL(msg.image)}
                            alt="User upload"
                            className="mt-2 max-h-32 rounded border"
                            />
                        )}
                        </div>
                        {/* Restore button for user messages that have associated components */}
                        {msg.type === 'prompt' && (() => {
                        const { components } = useChatbotComponentStore.getState();
                        const hasAssociatedComponent = components.some(comp => 
                            comp.metadata?.generatedFrom === (msg.id || msg.conversationId) ||
                            comp.metadata?.conversationId === (msg.id || msg.conversationId)
                        );
                        
                        return hasAssociatedComponent ? (
                            <div className="mt-1 ml-2">
                            <button
                                onClick={() => handleRestoreFromMessage(msg.id || msg.conversationId)}
                                className="text-xs cursor-pointer  bg-gray-300/90 hover:bg-gray-400/60 text-gray-700 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                                title="Restore component from this message"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Restore
                            </button>
                            </div>
                        ) : null;
                        })()}
                    </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex justify-end">
                    <div className="rounded-xl px-4 py-3 bg-green-100 text-gray-900 shadow text-sm animate-in flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        {code.jsx && code.css ? 'Modifying component...' : 'Generating component...'}
                    </div>
                    </div>
                )}
                
                {error && (
                    <div className="flex justify-end">
                    <div className="rounded-xl px-4 py-3 bg-red-100 text-red-800 shadow text-sm animate-in flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                    </div>
                )}
                </div>

                {/* Component History */}
                {/*<div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Component History</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {useChatbotComponentStore.getState().components?.map((component, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSelectVersion(component)}
                        className={`w-full text-left p-2 rounded text-xs transition-colors ${
                        component.isCurrent
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <div className="font-medium">{component.name}</div>
                        <div className="text-gray-500">{component.componentType}</div>
                    </button>
                    ))}
                </div>
                </div>*/}

                {/* Input Area */}
                <div className="flex gap-2 items-center mt-2">
                <input
                    type="text"
                    className="input flex-1"
                    placeholder="Describe your component..."
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
                    className="btn btn-outline"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    disabled={loading}
                    title="Attach image"
                >
                    <ImageIcon size={20} />
                </button>
                
                <button
                    className="btn btn-primary"
                    onClick={handleSend}
                    disabled={loading || (!userPrompt.trim() && !image)}
                    title="Send"
                >
                    <Send size={20} />
                </button>
                </div>
            </div>
            

            {/* Preview/Code Panel */}
            <div className="md:col-span-7 rounded-2xl w-full p-6 max-h-screen overflow-y-hidden drop-shadow-lg flex flex-col bg-white">
                <div className="flex gap-2 mb-4 border-b border-gray-200">
                <button
                    className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'preview'
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-gray-500 hover:text-blue-600'
                    }`}
                    onClick={() => setActiveTab('preview')}
                >
                    Preview
                    {code.jsx && code.css && useChatbotComponentStore.getState().components?.filter(c => c.isCurrent).length > 1 && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Modified
                    </span>
                    )}
                </button>
                <button
                    className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'code'
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-gray-500 hover:text-blue-600'
                    }`}
                    onClick={() => setActiveTab('code')}
                >
                    Code
                </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                {activeTab === 'preview' ? (
                    code.jsx ? (
                    <DynamicPreview jsx={code.jsx} css={code.css} />
                    ) : (
                    <div className="text-gray-400 text-center mt-20">No component generated yet.</div>
                    )
                ) : (
                    <div>
                    <div className="flex gap-2 mb-2">
                        <button
                        className="btn cursor-pointer btn-outline flex items-center gap-1"
                        onClick={() => copyToClipboard(code.jsx)}
                        disabled={!code.jsx}
                        title="Copy JSX/TSX"
                        >
                        <Copy size={16} /> JSX/TSX
                        </button>
                        <button
                        className="btn cursor-pointer btn-outline flex items-center gap-1"
                        onClick={() => copyToClipboard(code.css)}
                        disabled={!code.css}
                        title="Copy CSS"
                        >
                        <Copy size={16} /> CSS
                        </button>
                        <button
                        className="btn cursor-pointer btn-outline flex items-center gap-1"
                        onClick={() => {
                            if (code.jsx) {
                            downloadFile('Component.jsx', code.jsx);
                            }
                            if (code.css) {
                            downloadFile('styles.css', code.css);
                            }
                        }}
                        disabled={!code.jsx}
                        title="Download Files"
                        >
                        <Download size={16} /> Download
                        </button>
                    </div>
                    
                    <div className="mb-4">
                        <div className="font-semibold text-gray-700 mb-1">JSX/TSX</div>
                        <SyntaxHighlighter
                        language="jsx"
                        style={duotoneSpace}
                        customStyle={{ borderRadius: 8, fontSize: 14 }}
                        showLineNumbers
                        >
                        {code.jsx || ''}
                        </SyntaxHighlighter>
                    </div>
                    
                    <div>
                        <div className="font-semibold text-gray-700 mb-1">CSS</div>
                        <SyntaxHighlighter
                        language="css"
                        style={duotoneSpace}
                        customStyle={{ borderRadius: 8, fontSize: 14 }}
                        showLineNumbers
                        >
                        {code.css || ''}
                        </SyntaxHighlighter>
                    </div>
                    </div>
                )}
                </div>
            </div>
            </div>
        );
        };

        export default ChatbotAIEditor;
