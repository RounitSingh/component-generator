import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import JSZip from 'jszip';

// Vanilla store for Zustand v5
const downloadStore = createStore((set, get) => ({
	jsx: '',
	css: '',
	isZipping: false,

	setCode: (code) => set({ jsx: code?.jsx || '', css: code?.css || '' }),
	clearCode: () => set({ jsx: '', css: '' }), // 🔹 added clear action

	downloadZip: async () => {
		const { jsx, css } = get();
		if (!jsx && !css) return;
		set({ isZipping: true });
		try {
			const zip = new JSZip();
			if (jsx) zip.file('Component.jsx', jsx);
			if (css) zip.file('styles.css', css);
			const blob = await zip.generateAsync({ type: 'blob' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'component.zip';
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} finally {
			set({ isZipping: false });
		}
	},
}));

// Hook wrapper compatible with React components
const useDownloadStore = (selector) => useStore(downloadStore, selector);

export default useDownloadStore;
export { downloadStore };



