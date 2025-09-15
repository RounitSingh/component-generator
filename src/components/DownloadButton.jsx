import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import useDownloadStore from '../store/downloadStore';

const DownloadButton = ({ className = '' }) => {
	const jsx = useDownloadStore((s) => s.jsx);
	const isZipping = useDownloadStore((s) => s.isZipping);
	const downloadZip = useDownloadStore((s) => s.downloadZip);

	if (!jsx) return null;

	return (
		<button
			onClick={downloadZip}
			disabled={isZipping}
			className={`flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-400 ring-0 hover:ring-1 hover:ring-white/10 px-2 py-1.5 rounded-lg text-sm disabled:opacity-50 ${className}`}

			title="Download JSX + CSS as zip"
		>
			{isZipping ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				<Download className="w-4 h-4" />
			)}
		</button>
	);
};

export default DownloadButton;


