import React, { memo } from 'react';
import { User, Bot, DownloadCloud } from 'lucide-react';
import useChatbotComponentStore from '../../store/chatbotComponentStore';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

const MessageItem = memo(({ 
    message, 
    onRestoreFromMessage
}) => {
    const { components } = useChatbotComponentStore();
    
    const hasAssociatedComponent = components.some(comp =>
        comp.metadata?.generatedFrom && message.id && comp.metadata.generatedFrom === message.id
    );

    const isUser = message.type === 'prompt';

    return (
        <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} w-full`}>
            {/* Row container with avatar and bubble */}
            <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? '' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <Avatar className="h-8 w-8 shadow-sm ring-1 ring-white/10">
                    {isUser ? (
                        <AvatarFallback className="bg-[#0b0b0b] text-slate-300">
                            <User size={16} />
                        </AvatarFallback>
                    ) : (
                        <AvatarFallback className="bg-[#2B2B2B] text-slate-300">
                            <Bot size={16} />
                        </AvatarFallback>
                    )}
                </Avatar>

                {/* Message bubble + extras */}
                <div className={`flex flex-col ${isUser ? 'items-start' : 'items-end'} w-full`}>
                    <div className={`${
                        isUser
                            ? 'rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm'
                            : 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-sm'
                    } px-4 py-3 shadow-sm ${
                        isUser
                            ? 'bg-[#0b0b0b] text-slate-200 border border-white/5'
                            : 'bg-[#212223] text-slate-100 border border-white/5'
                    } w-full break-words overflow-hidden`}
                    >
                        <div className="break-words overflow-wrap-break-word whitespace-pre-wrap text-sm leading-relaxed">
                            {message.text}
                        </div>
                        {message.image && (
                            <img
                                src={URL.createObjectURL(message.image)}
                                alt="User upload"
                                className="mt-3 max-h-40 rounded-xl border border-white/10"
                            />
                        )}
                    </div>

                    {isUser && message.selectedTarget && (
                        <div className="mt-2 flex items-center gap-2 bg-[#111827] text-slate-300 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-medium">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span className="font-mono">Target: <span className="font-mono">{message.selectedTarget}</span></span>
                        </div>
                    )}

                    {(!isUser && (hasAssociatedComponent || message.component?.jsx)) && (
                        <button
                            onClick={() => onRestoreFromMessage(message)}
                            className="mt-2 flex items-center gap-2 bg-[#222226] hover:bg-[#1e1f1f] text-slate-200 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors"
                            title="Restore component from this message"
                        >
                            <DownloadCloud size={14} /> Restore 
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
