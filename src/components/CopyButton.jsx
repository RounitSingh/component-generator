import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text = '', disabled = false, size = 'sm', className = '' }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (disabled || !text) return;
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			console.error('Copy failed', err);
		}
	};

	const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={handleCopy}
			className={`inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-transparent text-slate-200 hover:bg-white/5 active:bg-white/10 transition-colors ${sizeClasses} disabled:opacity-50 ${className}`}
			title={copied ? 'Copied!' : 'Copy to clipboard'}
		>
			{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
			<span>{copied ? 'Copied' : 'Copy'}</span>
		</button>
	);
};

export default CopyButton;


