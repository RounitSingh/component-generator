import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import useDownloadStore from '../store/downloadStore';

const DownloadButton = ({ className = '', isMobile = false }) => {
	const jsx = useDownloadStore((s) => s.jsx);
	const isZipping = useDownloadStore((s) => s.isZipping);
	const downloadZip = useDownloadStore((s) => s.downloadZip);

	if (!jsx) return null;

	return (
		<button
			onClick={downloadZip}
			disabled={isZipping}
			className={`flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-400 ring-0 hover:ring-1 hover:ring-white/10 ${isMobile ? 'px-1.5 py-1' : 'px-2 py-1.5'} rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} disabled:opacity-50 ${className}`}

			title="Download JSX + CSS as zip"
		>
			{isZipping ? (
				<Loader2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} animate-spin`} />
			) : (
				<Download className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
			)}
		</button>
	);
};

export default DownloadButton;


