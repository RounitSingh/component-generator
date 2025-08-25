// import React, { useRef, useState, useEffect } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { Download, Copy, Send, Image as ImageIcon, Loader2, AlertCircle, StarsIcon, Edit3, X, ArrowDown } from 'lucide-react';
// import useChatbotChatStore from '../store/chatbotChatStore';
// import useChatbotComponentStore from '../store/chatbotComponentStore';
// import { generateComponentWithGemini } from '../utils/geminiApi';
// import DynamicPreview from '../components/DynamicPreview';

// const parseGeminiResponse = (text) => {
//     const jsxMatch = text.match(/```(?:jsx|tsx)?([\s\S]*?)```/i);
//     const cssMatch = text.match(/```css([\s\S]*?)```/i);
//     return {
//         jsx: jsxMatch ? jsxMatch[1].trim() : '',
//         css: cssMatch ? cssMatch[1].trim() : '',
//     };
// };

// const downloadFile = (filename, content) => {
//     const blob = new Blob([content], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
// };

// const copyToClipboard = async (text) => {
//     try {
//         await navigator.clipboard.writeText(text);
//     } catch {
//         // Failed to copy to clipboard
//     }
// };

// const toBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//             if (typeof reader.result === 'string') {
//                 const base64 = reader.result.split(',')[1];
//                 resolve(base64);
//             } else {
//                 reject(new Error('FileReader result is not a string'));
//             }
//         };
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//     });
// };

// const ChatbotAIEditor = () => {
//     const {
//         messages,
//         addMessage,
//         clearMessages,
//     } = useChatbotChatStore();

//     const {
//         addComponent,
//         clearComponents,
//         clearError: clearComponentError,
//         editMode,
//         selectedElement,
//         setEditMode,
//         clearSelectedElement,
//         editModeError,
//         isElementSelectionValid,
//         validateSelectedElement,
//     } = useChatbotComponentStore();

//     const [code, setCode] = useState({ jsx: '', css: '' });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [activeTab, setActiveTab] = useState('preview');
//     const [userPrompt, setUserPrompt] = useState('');
//     const [image, setImage] = useState(null);
//     const fileInputRef = useRef(null);

//     const messagesEndRef = useRef(null);
//     const chatContainerRef = useRef(null);

//     // 🆕 Track scroll button visibility
//     const [showScrollButton, setShowScrollButton] = useState(false);

//     // 🆕 Scroll to bottom helper
//     const scrollToBottom = (smooth = true) => {
//         if (messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({
//                 behavior: smooth ? "smooth" : "auto",
//                 block: "end",
//             });
//         }
//     };

//     // 🆕 Auto-scroll when messages or loading change
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, loading]);

//     // 🆕 Show/hide floating button based on user scroll
//     const handleScroll = () => {
//         if (!chatContainerRef.current) { return; }
//         const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
//         const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
//         setShowScrollButton(!isAtBottom);
//     };

//     // Clear errors when component mounts
//     useEffect(() => {
//         setError('');
//         clearComponentError();
//     }, [clearComponentError]);

//     // Helper to format selected element label
//     const formatSelectedElementLabel = (sel) => {
//         if (!sel) { return '' };
//         const idPart = sel.id ? `#${sel.id}` : '';
//         const firstClass = sel.className ? String(sel.className).split(' ').filter(Boolean)[0] : '';
//         const classPart = firstClass ? `.${firstClass}` : '';
//         return `${sel.tagName}${idPart}${classPart}`;
//     };

//     const handleSend = async () => {
//         if (!userPrompt.trim() && !image) { return };

//         // Enforce element selection in edit mode
//         if (editMode && !selectedElement) {
//             setError('Select an element in Edit Mode before sending.');
//             return;
//         }

//         // Validate selected element if in edit mode
//         if (editMode && selectedElement) {
//             const valid = validateSelectedElement();
//             if (!valid) {
//                 setError('Please reselect the element.');
//                 return;
//             }
//         }

//         setLoading(true);
//         setError('');

//         const conversationId = `chatbot_${Date.now()}`;

//         const promptMsg = {
//             type: 'prompt',
//             text: userPrompt,
//             image: image || null,
//             conversationId,
//             // annotate selected target (for UI badge in chat)
//             selectedTarget: editMode && selectedElement ? formatSelectedElementLabel(selectedElement) : null,
//         };

//         try {
//             // Add user message to local state immediately
//             addMessage(promptMsg);

//             // Check if this is a follow-up prompt (modifying existing component)
//             const hasExistingComponent = code.jsx && code.css;
//             const isFollowUpPrompt = hasExistingComponent && messages.length > 0;
//             const isTargetedEdit = editMode && selectedElement && isFollowUpPrompt && isElementSelectionValid;

//             // Prepare AI request with context
//             let promptText = userPrompt;
//             let imagePart = [];

//             if (isTargetedEdit) {
//                 // For targeted element editing, include specific element context
//                 promptText = `I want to modify a specific element in my React component. Please apply the following changes to ONLY the selected element: "${userPrompt}"

//         Selected Element Details:
//         - Tag: ${selectedElement.tagName}
//         - Classes: ${selectedElement.className || 'none'}
//         - ID: ${selectedElement.id || 'none'}
//         - Text Content: ${selectedElement.textContent || 'none'}
//         - Element Path: ${selectedElement.path}

//         Current JSX code:
//         \`\`\`jsx
//         ${code.jsx}
//         \`\`\`

//         Current CSS code:
//         \`\`\`css
//         ${code.css}
//         \`\`\`

//         Please provide the complete updated component with ONLY the requested changes applied to the specified element. Do not modify other elements.`;
//             } else if (isFollowUpPrompt) {
//                 // For follow-up prompts, include the current component code
//                 promptText = `I have an existing React component. Please modify it according to this request: "${userPrompt}"

//         Current JSX code:
//         \`\`\`jsx
//         ${code.jsx}
//         \`\`\`

//         Current CSS code:
//         \`\`\`css
//         ${code.css}
//         \`\`\`

//         Please provide the complete updated component with the requested changes.`;
//             }

//             if (image) {
//                 promptText += '\n[Image attached]';
//                 imagePart = [
//                     {
//                         inlineData: {
//                             mimeType: image.type,
//                             data: await toBase64(image),
//                         },
//                     },
//                 ];
//             }

//             // Generate AI response
//             const output = await generateComponentWithGemini(promptText, imagePart, isFollowUpPrompt);

//             // Add AI response to local state
//             const responseMsg = {
//                 type: 'response',
//                 text: output,
//                 conversationId,
//             };
//             addMessage(responseMsg);

//             // Parse and set component code
//             const parsed = parseGeminiResponse(output);
//             setCode(parsed);

//             // Add component to local state
//             if (parsed.jsx && parsed.css) {
//                 const componentData = {
//                     name: isFollowUpPrompt ? 'ModifiedAIComponent' : 'AIComponent',
//                     jsxCode: parsed.jsx,
//                     cssCode: parsed.css,
//                     componentType: isTargetedEdit ? 'targeted-edit' : (isFollowUpPrompt ? 'modified' : 'generated'),
//                     metadata: {
//                         conversationId,
//                         isFollowUpPrompt,
//                         isTargetedEdit,
//                         selectedElement: isTargetedEdit ? {
//                             tagName: selectedElement.tagName,
//                             className: selectedElement.className,
//                             id: selectedElement.id,
//                             path: selectedElement.path
//                         } : null,
//                         previousComponentExists: hasExistingComponent,
//                         modificationPrompt: isFollowUpPrompt ? userPrompt : null,
//                     },
//                 };

//                 addComponent({
//                     ...componentData,
//                     isCurrent: true,
//                 });
//             }

//             // Do NOT auto-clear selection here; persist until user clears or re-selects

//         } catch {
//             setError('Error generating component. Please try again.');
//             addMessage({ type: 'response', text: 'Error generating component. Please try again.' });
//         } finally {
//             setLoading(false);
//             setUserPrompt('');
//             setImage(null);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSend();
//         }
//     };

//     const handleRestoreFromMessage = (messageId) => {
//         const { restoreComponentFromMessage } = useChatbotComponentStore.getState();
//         const restoredComponent = restoreComponentFromMessage(messageId);

//         if (restoredComponent) {
//             setCode({
//                 jsx: restoredComponent.jsxCode,
//                 css: restoredComponent.cssCode
//             });
//         }
//     };

//     const handleClearChat = () => {
//         clearMessages();
//         clearComponents();
//         setCode({ jsx: '', css: '' });
//         setError('');
//     };

//     return (
//         <div className="h-screen p-4 gap-4 grid grid-cols-1 md:grid-cols-10">
//             {/* Chat Panel */}
//             <div className="md:col-span-3 w-full p-6 flex flex-col rounded-2xl border-gray-200 drop-shadow-lg max-h-screen overflow-y-auto  bg-white relative">
//                 <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-2xl flex flex-row gap-2 font-bold text-blue-700">
//                         <span className="rounded-lg bg-blue-500 p-2">
//                             <StarsIcon className='h-5 w-5 text-blue-50' />
//                         </span>
//                         GenUi
//                     </h2>
//                     <div className="flex items-center gap-4">
//                         {code.jsx && code.css && (
//                             <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
//                                 Component v{useChatbotComponentStore.getState().components?.filter(c => c.isCurrent).length || 1}
//                             </div>
//                         )}
//                         <button
//                             onClick={handleClearChat}
//                             className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100"
//                             title="Clear chat"
//                         >
//                             Clear
//                         </button>
//                     </div>
//                 </div>

//                 {/* Messages */}
//                 <div
//                     ref={chatContainerRef}          // 🆕 attach ref
//                     onScroll={handleScroll}         // 🆕 track scroll
//                     className="flex-1 h-[400px] overflow-y-auto overflow-x-hidden mb-4 space-y-3 pr-2 relative">
//                     {messages.map((msg, idx) => (
//                         <div key={msg.id || idx} className={`flex w-full ${msg.type === 'prompt' ? 'justify-start' : 'justify-end'}`}>
//                             <div
//                                 className={`flex flex-col max-w-[80%] ${msg.type === 'prompt' ? 'items-start' : 'items-end'
//                                     }`}
//                             >
//                                 <div
//                                     className={`rounded-xl px-4 py-3 max-w-[80%] shadow text-sm whitespace-pre-line animate-in ${msg.type === 'prompt'
//                                             ? 'bg-blue-100 text-gray-800'
//                                             : 'bg-green-100 text-gray-900'
//                                         }`}
//                                 >
//                                     {msg.text}
//                                     {msg.image && (
//                                         <img
//                                             src={URL.createObjectURL(msg.image)}
//                                             alt="User upload"
//                                             className="mt-2 max-h-32 rounded border"
//                                         />
//                                     )}
//                                 </div>
//                                 {/* Target element chip for prompts */}
//                                 {msg.type === 'prompt' && msg.selectedTarget && (
//                                     <div className="mt-1 ml-2 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
//                                         <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
//                                         Target: <span className="font-mono">{msg.selectedTarget}</span>
//                                     </div>
//                                 )}
//                                 {/* Restore button for user messages that have associated components */}
//                                 {msg.type === 'prompt' && (() => {
//                                     const { components } = useChatbotComponentStore.getState();
//                                     const hasAssociatedComponent = components.some(comp =>
//                                         comp.metadata?.generatedFrom === (msg.id || msg.conversationId) ||
//                                         comp.metadata?.conversationId === (msg.id || msg.conversationId)
//                                     );

//                                     return hasAssociatedComponent ? (
//                                         <div className="mt-1 ml-2">
//                                             <button
//                                                 onClick={() => handleRestoreFromMessage(msg.id || msg.conversationId)}
//                                                 className="text-xs cursor-pointer  bg-gray-300/90 hover:bg-gray-400/60 text-gray-700 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
//                                                 title="Restore component from this message"
//                                             >
//                                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                                 </svg>
//                                                 Restore
//                                             </button>
//                                         </div>
//                                     ) : null;
//                                 })()}
//                             </div>
//                         </div>
//                     ))}

//                     {loading && (
//                         <div className="flex justify-end">
//                             <div className="rounded-xl px-4 py-3 bg-green-100 text-gray-900 shadow text-sm animate-in flex items-center gap-2">
//                                 <Loader2 className="animate-spin h-4 w-4" />
//                                 {code.jsx && code.css ? (editMode && selectedElement ? 'Modifying selected element...' : 'Modifying component...') : 'Generating component...'}
//                             </div>
//                         </div>
//                     )}

//                     {error && (
//                         <div className="flex justify-end">
//                             <div className="rounded-xl px-4 py-3 bg-red-100 text-red-800 shadow text-sm animate-in flex items-center gap-2">
//                                 <AlertCircle className="h-4 w-4" />
//                                 {error}
//                             </div>
//                         </div>
//                     )}

//                     {editModeError && (
//                         <div className="flex justify-end">
//                             <div className="rounded-xl px-4 py-3 bg-yellow-100 text-yellow-800 shadow text-sm animate-in flex items-center gap-2">
//                                 <AlertCircle className="h-4 w-4" />
//                                 {editModeError}
//                             </div>
//                         </div>
//                     )}

//                     {/* 🆕 Marker for auto-scroll */}
//                     <div ref={messagesEndRef} />
//                      {/* 🆕 Marker for auto-scroll */}
//                 {showScrollButton && (
//                     <button
//                         onClick={() => scrollToBottom()}
//                         className="sticky  bottom-4 left-full bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
//                         title="Scroll to bottom"
//                     >
//                         <ArrowDown size={20} />
//                     </button>
//                 )}
//                 </div>


               

//                 {/* Input Area */}
//                 <div className="mt-2">
//                     {selectedElement && isElementSelectionValid && (
//                         <div className="mb-2 -mx-2 px-2 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                                 <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
//                                 <span className="font-medium">Target element</span>
//                                 <span className="font-mono">{formatSelectedElementLabel(selectedElement)}</span>
//                                 {editMode ? (
//                                     <span className="ml-2 text-[10px] text-blue-600/80">(Edit Mode ON)</span>
//                                 ) : (
//                                     <span className="ml-2 text-[10px] text-blue-600/80">(persisted until cleared)</span>
//                                 )}
//                             </div>
//                             <button
//                                 onClick={clearSelectedElement}
//                                 className="text-blue-600 hover:text-red-600 p-1"
//                                 title="Clear selected element"
//                             >
//                                 <X size={14} />
//                             </button>
//                         </div>
//                     )}
//                     <div className="flex gap-2 items-center flex-wrap">
//                         <input
//                             type="text"
//                             className="input flex-1"
//                             placeholder={editMode && selectedElement ?
//                                 `Modify the selected ${selectedElement.tagName} element...` :
//                                 editMode ? 'Select an element in the preview to target...' : "Describe your component..."
//                             }
//                             value={userPrompt}
//                             onChange={(e) => setUserPrompt(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             disabled={loading}
//                         />

//                         <input
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             ref={fileInputRef}
//                             onChange={(e) => {
//                                 if (e.target.files && e.target.files[0]) {
//                                     setImage(e.target.files[0]);
//                                 }
//                             }}
//                             disabled={loading}
//                         />

//                         <button
//                             className="btn btn-outline"
//                             onClick={() => fileInputRef.current && fileInputRef.current.click()}
//                             disabled={loading}
//                             title="Attach image"
//                         >
//                             <ImageIcon size={20} />
//                         </button>

//                         <button
//                             className="btn btn-primary"
//                             onClick={handleSend}
//                             disabled={loading || (!userPrompt.trim() && !image) || (editMode && !selectedElement)}
//                             title={editMode && !selectedElement ? 'Select an element to target' : 'Send'}
//                         >
//                             <Send size={20} />
//                         </button>
//                     </div>
//                 </div>
//             </div>


//             {/* Preview/Code Panel */}
//             <div className="md:col-span-7 rounded-2xl w-full p-6 max-h-screen overflow-y-hidden drop-shadow-lg flex flex-col bg-white">
//                 <div className="flex justify-between items-center mb-4 border-b border-gray-200">
//                     <div className="flex gap-2">
//                         <button
//                             className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'preview'
//                                     ? 'border-blue-600 text-blue-700'
//                                     : 'border-transparent text-gray-500 hover:text-blue-600'
//                                 }`}
//                             onClick={() => setActiveTab('preview')}
//                         >
//                             Preview
//                             {code.jsx && code.css && useChatbotComponentStore.getState().components?.filter(c => c.isCurrent).length > 1 && (
//                                 <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
//                                     Modified
//                                 </span>
//                             )}
//                         </button>
//                         <button
//                             className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'code'
//                                     ? 'border-blue-600 text-blue-700'
//                                     : 'border-transparent text-gray-500 hover:text-blue-600'
//                                 }`}
//                             onClick={() => setActiveTab('code')}
//                         >
//                             Code
//                         </button>
//                     </div>

//                     {/* Edit Switch Button */}
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-600">Edit Mode</span>
//                         <button
//                             onClick={() => {
//                                 setEditMode(!editMode);
//                                 // Selection persists; user can clear or re-select later
//                             }}
//                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editMode ? 'bg-blue-600' : 'bg-gray-200'
//                                 }`}
//                             title={editMode ? 'Disable edit mode' : 'Enable edit mode'}
//                         >
//                             <span
//                                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editMode ? 'translate-x-6' : 'translate-x-1'
//                                     }`}
//                             />
//                         </button>
//                         {selectedElement && (
//                             <button
//                                 onClick={clearSelectedElement}
//                                 className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100"
//                                 title="Clear selection"
//                             >
//                                 <X size={14} />
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto">
//                     {activeTab === 'preview' ? (
//                         code.jsx ? (
//                             <DynamicPreview jsx={code.jsx} css={code.css} />
//                         ) : (
//                             <div className="text-gray-400 text-center mt-20">No component generated yet.</div>
//                         )
//                     ) : (
//                         <div>
//                             <div className="flex gap-2 mb-2">
//                                 <button
//                                     className="btn cursor-pointer btn-outline flex items-center gap-1"
//                                     onClick={() => copyToClipboard(code.jsx)}
//                                     disabled={!code.jsx}
//                                     title="Copy JSX/TSX"
//                                 >
//                                     <Copy size={16} /> JSX/TSX
//                                 </button>
//                                 <button
//                                     className="btn cursor-pointer btn-outline flex items-center gap-1"
//                                     onClick={() => copyToClipboard(code.css)}
//                                     disabled={!code.css}
//                                     title="Copy CSS"
//                                 >
//                                     <Copy size={16} /> CSS
//                                 </button>
//                                 <button
//                                     className="btn cursor-pointer btn-outline flex items-center gap-1"
//                                     onClick={() => {
//                                         if (code.jsx) {
//                                             downloadFile('Component.jsx', code.jsx);
//                                         }
//                                         if (code.css) {
//                                             downloadFile('styles.css', code.css);
//                                         }
//                                     }}
//                                     disabled={!code.jsx}
//                                     title="Download Files"
//                                 >
//                                     <Download size={16} /> Download
//                                 </button>
//                             </div>

//                             <div className="mb-4">
//                                 <div className="font-semibold text-gray-700 mb-1">JSX/TSX</div>
//                                 <SyntaxHighlighter
//                                     language="jsx"
//                                     style={duotoneSpace}
//                                     customStyle={{ borderRadius: 8, fontSize: 14 }}
//                                     showLineNumbers
//                                 >
//                                     {code.jsx || ''}
//                                 </SyntaxHighlighter>
//                             </div>

//                             <div>
//                                 <div className="font-semibold text-gray-700 mb-1">CSS</div>
//                                 <SyntaxHighlighter
//                                     language="css"
//                                     style={duotoneSpace}
//                                     customStyle={{ borderRadius: 8, fontSize: 14 }}
//                                     showLineNumbers
//                                 >
//                                     {code.css || ''}
//                                 </SyntaxHighlighter>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChatbotAIEditor;


import React, { useRef, useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Download, Copy, Send, Image as ImageIcon, Loader2, AlertCircle, StarsIcon, Edit3, X, ArrowDown } from 'lucide-react';
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
        editMode,
        selectedElement,
        setEditMode,
        clearSelectedElement,
        editModeError,
        isElementSelectionValid,
        validateSelectedElement,
    } = useChatbotComponentStore();

    const [code, setCode] = useState({ jsx: '', css: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('preview');
    const [userPrompt, setUserPrompt] = useState('');
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // 🆕 Track scroll button visibility
    const [showScrollButton, setShowScrollButton] = useState(false);

    // 🆕 Scroll to bottom helper
    const scrollToBottom = (smooth = true) => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: smooth ? "smooth" : "auto"
            });
        }
    };

    // 🆕 Auto-scroll when messages or loading change
    useEffect(() => {
        scrollToBottom(false);
    }, [messages, loading]);

    // 🆕 Show/hide floating button based on user scroll
    const handleScroll = () => {
        if (!chatContainerRef.current) { return; }
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
        setShowScrollButton(!isAtBottom);
    };

    // Clear errors when component mounts
    useEffect(() => {
        setError('');
        clearComponentError();
    }, [clearComponentError]);

    // Helper to format selected element label
    const formatSelectedElementLabel = (sel) => {
        if (!sel) { return '' };
        const idPart = sel.id ? `#${sel.id}` : '';
        const firstClass = sel.className ? String(sel.className).split(' ').filter(Boolean)[0] : '';
        const classPart = firstClass ? `.${firstClass}` : '';
        return `${sel.tagName}${idPart}${classPart}`;
    };

    const handleSend = async () => {
        if (!userPrompt.trim() && !image) { return };

        // Enforce element selection in edit mode
        if (editMode && !selectedElement) {
            setError('Select an element in Edit Mode before sending.');
            return;
        }

        // Validate selected element if in edit mode
        if (editMode && selectedElement) {
            const valid = validateSelectedElement();
            if (!valid) {
                setError('Please reselect the element.');
                return;
            }
        }

        setLoading(true);
        setError('');

        const conversationId = `chatbot_${Date.now()}`;

        const promptMsg = {
            type: 'prompt',
            text: userPrompt,
            image: image || null,
            conversationId,
            // annotate selected target (for UI badge in chat)
            selectedTarget: editMode && selectedElement ? formatSelectedElementLabel(selectedElement) : null,
        };

        try {
            // Add user message to local state immediately
            addMessage(promptMsg);

            // Check if this is a follow-up prompt (modifying existing component)
            const hasExistingComponent = code.jsx && code.css;
            const isFollowUpPrompt = hasExistingComponent && messages.length > 0;
            const isTargetedEdit = editMode && selectedElement && isFollowUpPrompt && isElementSelectionValid;

            // Prepare AI request with context
            let promptText = userPrompt;
            let imagePart = [];

            if (isTargetedEdit) {
                // For targeted element editing, include specific element context
                promptText = `I want to modify a specific element in my React component. Please apply the following changes to ONLY the selected element: "${userPrompt}"

        Selected Element Details:
        - Tag: ${selectedElement.tagName}
        - Classes: ${selectedElement.className || 'none'}
        - ID: ${selectedElement.id || 'none'}
        - Text Content: ${selectedElement.textContent || 'none'}
        - Element Path: ${selectedElement.path}

        Current JSX code:
        \`\`\`jsx
        ${code.jsx}
        \`\`\`

        Current CSS code:
        \`\`\`css
        ${code.css}
        \`\`\`

        Please provide the complete updated component with ONLY the requested changes applied to the specified element. Do not modify other elements.`;
            } else if (isFollowUpPrompt) {
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
                    componentType: isTargetedEdit ? 'targeted-edit' : (isFollowUpPrompt ? 'modified' : 'generated'),
                    metadata: {
                        conversationId,
                        isFollowUpPrompt,
                        isTargetedEdit,
                        selectedElement: isTargetedEdit ? {
                            tagName: selectedElement.tagName,
                            className: selectedElement.className,
                            id: selectedElement.id,
                            path: selectedElement.path
                        } : null,
                        previousComponentExists: hasExistingComponent,
                        modificationPrompt: isFollowUpPrompt ? userPrompt : null,
                    },
                };

                addComponent({
                    ...componentData,
                    isCurrent: true,
                });
            }

            // Do NOT auto-clear selection here; persist until user clears or re-selects

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
        <div className="h-screen p-4 gap-4 grid grid-cols-1 md:grid-cols-10 overflow-hidden">
            {/* Chat Panel */}
            <div className="md:col-span-3 w-full p-6 flex flex-col rounded-2xl border-gray-200 drop-shadow-lg max-h-screen overflow-hidden bg-white relative">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl flex flex-row gap-2 font-bold text-blue-700">
                        <span className="rounded-lg bg-blue-500 p-2">
                            <StarsIcon className='h-5 w-5 text-blue-50' />
                        </span>
                        GenUi
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
                <div
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto overflow-x-hidden mb-4 space-y-3 pt-4 pr-1 relative"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                >
                    {messages.map((msg, idx) => (
                        <div key={msg.id || idx} className={`flex w-full ${msg.type === 'prompt' ? 'justify-start' : 'justify-end'}`}>
                            <div
                                className={`flex flex-col max-w-[80%] ${msg.type === 'prompt' ? 'items-start' : 'items-end'
                                    }`}
                            >
                                <div
                                    className={`rounded-xl px-4 py-3 max-w-[80%] shadow text-sm whitespace-pre-line animate-in ${msg.type === 'prompt'
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
                                {/* Target element chip for prompts */}
                                {msg.type === 'prompt' && msg.selectedTarget && (
                                    <div className="mt-1 ml-2 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                        Target: <span className="font-mono">{msg.selectedTarget}</span>
                                    </div>
                                )}
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
                                {code.jsx && code.css ? (editMode && selectedElement ? 'Modifying selected element...' : 'Modifying component...') : 'Generating component...'}
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

                    {editModeError && (
                        <div className="flex justify-end">
                            <div className="rounded-xl px-4 py-3 bg-yellow-100 text-yellow-800 shadow text-sm animate-in flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {editModeError}
                            </div>
                        </div>
                    )}

                    {/* 🆕 Marker for auto-scroll */}
                    <div ref={messagesEndRef} />
                    
                    {/* 🆕 Floating scroll to bottom button */}
                    {showScrollButton && (
                        <button
                            onClick={() => scrollToBottom()}
                            className="sticky bottom-4 left-full ml-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                            title="Scroll to bottom"
                            style={{ zIndex: 10 }}
                        >
                            <ArrowDown size={20} />
                        </button>
                    )}
                </div>

                {/* Input Area */}
                <div className="mt-2">
                    {selectedElement && isElementSelectionValid && (
                        <div className="mb-2 -mx-2 px-2 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                <span className="font-medium">Target element</span>
                                <span className="font-mono">{formatSelectedElementLabel(selectedElement)}</span>
                                {editMode ? (
                                    <span className="ml-2 text-[10px] text-blue-600/80">(Edit Mode ON)</span>
                                ) : (
                                    <span className="ml-2 text-[10px] text-blue-600/80">(persisted until cleared)</span>
                                )}
                            </div>
                            <button
                                onClick={clearSelectedElement}
                                className="text-blue-600 hover:text-red-600 p-1"
                                title="Clear selected element"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <div className="flex gap-2 items-center flex-wrap">
                        <input
                            type="text"
                            className="input flex-1"
                            placeholder={editMode && selectedElement ?
                                `Modify the selected ${selectedElement.tagName} element...` :
                                editMode ? 'Select an element in the preview to target...' : "Describe your component..."
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
                            disabled={loading || (!userPrompt.trim() && !image) || (editMode && !selectedElement)}
                            title={editMode && !selectedElement ? 'Select an element to target' : 'Send'}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview/Code Panel */}
            <div className="md:col-span-7 rounded-2xl w-full p-6 max-h-screen overflow-hidden drop-shadow-lg flex flex-col bg-white">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200">
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'preview'
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
                            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'code'
                                    ? 'border-blue-600 text-blue-700'
                                    : 'border-transparent text-gray-500 hover:text-blue-600'
                                }`}
                            onClick={() => setActiveTab('code')}
                        >
                            Code
                        </button>
                    </div>

                    {/* Edit Switch Button */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Edit Mode</span>
                        <button
                            onClick={() => {
                                setEditMode(!editMode);
                                // Selection persists; user can clear or re-select later
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editMode ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            title={editMode ? 'Disable edit mode' : 'Enable edit mode'}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        {selectedElement && (
                            <button
                                onClick={clearSelectedElement}
                                className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100"
                                title="Clear selection"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
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