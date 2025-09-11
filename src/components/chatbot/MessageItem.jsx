import React, { memo } from 'react';
import useChatbotComponentStore from '../../store/chatbotComponentStore';

const MessageItem = memo(({ 
    message, 
    onRestoreFromMessage
}) => {
    const { components } = useChatbotComponentStore();
    
    const hasAssociatedComponent = components.some(comp =>
        comp.metadata?.generatedFrom && message.id && comp.metadata.generatedFrom === message.id
    );

    return (
        <div className={`flex ${message.type === 'prompt' ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex flex-col max-w-[85%] ${message.type === 'prompt' ? 'items-start' : 'items-end'}`}>
                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.type === 'prompt'
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-900 drop-shadow-sm'
                        : 'bg-cyan-50 drop-shadow-sm'
                } w-full break-words overflow-hidden`}>
                    <div className="break-words overflow-wrap-break-word whitespace-pre-wrap text-sm leading-relaxed">
                        {message.text}
                    </div>
                    {message.image && (
                        <img
                            src={URL.createObjectURL(message.image)}
                            alt="User upload"
                            className="mt-3 max-h-32 rounded-xl border border-slate-200"
                        />
                    )}
                </div>
                
                {message.type === 'prompt' && message.selectedTarget && (
                    <div className="mt-2 flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 drop-shadow-xs rounded-full px-3 py-1.5 text-xs font-medium">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        <span className="text-xs font-mono">
                            Target: <span className="font-mono text-xs">{message.selectedTarget}</span>
                        </span>
                    </div>
                )}
                
                {(message.type === 'response' && (hasAssociatedComponent || message.component?.jsx)) && (
                    <button
                        onClick={() => onRestoreFromMessage(message)}
                        className="mt-2 flex items-center gap-2 drop-shadow-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                        title="Restore component from this message"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Restore
                    </button>
                )}
            </div>
        </div>
    );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
