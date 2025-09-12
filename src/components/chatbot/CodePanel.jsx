import React, { memo, lazy, Suspense } from 'react';
import { Download, Copy } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/chatbotUtils';

// Lazy load syntax highlighter to reduce initial bundle size
import { oneDark  } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(module => ({
    default: module.Prism
})));

const CodePanel = memo(({ code }) => {
    const handleDownload = () => {
        if (code.jsx) {
            downloadFile('Component.jsx', code.jsx);
        }
        if (code.css) {
            downloadFile('styles.css', code.css);
        }
    };

    return (
        <div className="h-full overflow-auto p-6">
            <div className="flex gap-3 mb-6">
                <button
                    className="flex items-center gap-2 px-4 py-2.5 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                    onClick={() => copyToClipboard(code.jsx)}
                    disabled={!code.jsx}
                    title="Copy JSX/TSX"
                >
                    <Copy size={16} /> JSX/TSX
                </button>
                <button
                    className="flex items-center gap-2 px-4 py-2.5 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                    onClick={() => copyToClipboard(code.css)}
                    disabled={!code.css}
                    title="Copy CSS"
                >
                    <Copy size={16} /> CSS
                </button>
                <button
                    className="flex items-center gap-2 px-4 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                    onClick={handleDownload}
                    disabled={!code.jsx}
                    title="Download Files"
                >
                    <Download size={16} /> Download
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        JSX/TSX
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-lg">React</span>
                    </h3>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        <Suspense fallback={<div className="p-4 text-slate-500">Loading syntax highlighter...</div>}>
                            <SyntaxHighlighter
                                language="jsx"
                                style={oneDark }
                                customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    fontSize: '14px',
                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                                }}
                                showLineNumbers
                            >
                                {code.jsx || '// No JSX code generated yet'}
                            </SyntaxHighlighter>
                        </Suspense>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        CSS
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-lg">Styles</span>
                    </h3>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        <Suspense fallback={<div className="p-4 text-slate-500">Loading syntax highlighter...</div>}>
                            <SyntaxHighlighter
                                language="css"
                                style={oneDark }
                                customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    fontSize: '14px',
                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                                }}
                                showLineNumbers
                            >
                                {code.css || '/* No CSS code generated yet */'}
                            </SyntaxHighlighter>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
});

CodePanel.displayName = 'CodePanel';

export default CodePanel;

