import React, { memo, useRef, useEffect, useCallback } from 'react';
import { ArrowDown, Loader2, AlertCircle } from 'lucide-react';
import MessageItem from './MessageItem';
import { formatSelectedElementLabel } from '../../utils/chatbotUtils';

const MessageList = memo(({ 
    messages, 
    loading, 
    error, 
    editModeError, 
    showScrollButton, 
    onRestoreFromMessage,
    code,
    editMode,
    selectedElement
}) => {
    const chatContainerRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback((smooth = true) => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom(false);
    }, [messages, loading, scrollToBottom]);

    const handleScroll = useCallback(() => {
        if (!chatContainerRef.current) return;
        // Parent may decide on scroll button visibility; do not spam console
        // const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    }, []);

    return (
        <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto px-3 py-4 space-y-4 scroll-smooth thin-dark-scrollbar"
        >
            {messages.map((msg, idx) => (
                <MessageItem
                    key={msg.id || idx}
                    message={msg}
                    onRestoreFromMessage={onRestoreFromMessage}
                    formatSelectedElementLabel={formatSelectedElementLabel}
                />
            ))}

            {loading && (
                <div className="flex justify-end">
                    <div className="flex items-center gap-3 px-4 py-3 shadow-sm ring-1 ring-white/10 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-md bg-[#212223] text-slate-100 border border-white/5">
                        <Loader2 className="animate-spin h-4 w-4 text-slate-300" />
                        <span className="text-sm">
                            {code.jsx && code.css
                                ? (editMode && selectedElement ? 'Modifying selected element…' : 'Modifying component…')
                                : 'Generating component…'}
                        </span>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex justify-end">
                    <div className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 rounded-2xl px-4 py-3 shadow-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                </div>
            )}

            {editModeError && (
                <div className="flex justify-end">
                    <div className="flex items-center gap-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl px-4 py-3 shadow-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{editModeError}</span>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />

            {showScrollButton && (
                <button
                    onClick={() => scrollToBottom()}
                    className="sticky bottom-2 drop-shadow-md cursor-pointer left-full ml-4 bg-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
                    title="Scroll to bottom"
                    style={{ zIndex: 10 }}
                >
                    <ArrowDown size={20} />
                </button>
            )}
        </div>
    );
});

MessageList.displayName = 'MessageList';

export default MessageList;
