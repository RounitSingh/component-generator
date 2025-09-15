import React, { memo, lazy, Suspense } from 'react';
 
import CopyButton from '../CopyButton';

// Lazy load syntax highlighter to reduce initial bundle size
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(module => ({
    default: module.Prism
})));

const CodePanel = memo(({ code }) => {
    

    return (
        <div className="h-full overflow-auto p-6 thin-dark-scrollbar">
            

            <div className="space-y-6">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-200">JSX/TSX</h3>
                        <CopyButton text={code.jsx || ''} disabled={!code.jsx} size="sm" />
                    </div>
                    <div className="relative rounded-md overflow-hidden border border-white/10 ring-1 ring-white/10 bg-[#0b0b0b] shadow-sm">
                        <Suspense fallback={<div className="p-4 text-slate-500">Loading syntax highlighter...</div>}>
                            <SyntaxHighlighter
                                language="jsx"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    fontSize: '14px',
                                    backgroundColor: '#0b0b0b',
                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                                }}
                                lineNumberStyle={{ color: '#cbd5e1' }}
                                showLineNumbers
                            >
                                {code.jsx || '// No JSX code generated yet'}
                            </SyntaxHighlighter>
                        </Suspense>
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-200">CSS</h3>
                        <CopyButton text={code.css || ''} disabled={!code.css} size="sm" />
                    </div>
                    <div className="relative rounded-md overflow-hidden border border-white/10 ring-1 ring-white/10 bg-[#0b0b0b] shadow-sm">
                        <Suspense fallback={<div className="p-4 text-slate-500">Loading syntax highlighter...</div>}>
                            <SyntaxHighlighter
                                language="css"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    fontSize: '14px',
                                    backgroundColor: '#0b0b0b',
                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                                }}
                                lineNumberStyle={{ color: '#cbd5e1' }}
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

