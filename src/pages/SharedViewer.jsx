import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicSharedComponent } from '../utils/api';

const DynamicPreview = lazy(() => import('../components/DynamicPreview'));

const SharedViewer = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getPublicSharedComponent(slug);
        const payload = res;
        if (!mounted) return;
        setData(payload || null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Not found');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  const resolveCode = (payload) => {
    if (!payload) return { jsx: '', css: '' };
    const d = payload;
    const jsx = d.jsx || d.jsxCode || d?.component?.jsx || d?.data?.jsx || '';
    const css = d.css || d.cssCode || d?.component?.css || d?.data?.css || '';
    return { jsx, css };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-slate-300 flex items-center justify-center">Loading…</div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-red-300 flex items-center justify-center">{error}</div>
    );
  }
  const { jsx, css } = resolveCode(data);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200">
      <div className="max-w-auto mx-auto ">
       {/**  <div className="mb-6 flex items-center justify-between">
          <h1 className="text-sm text-slate-400">Shared Component</h1>
          <a className="text-xs text-slate-400 underline" href="/" rel="noreferrer">Create your own</a>
        </div>*/}
        {jsx ? (
          <div className=" overflow-hidden bg-[#151515] border border-[#232323] min-h-[70vh]">
            <Suspense fallback={<div className="p-6 text-slate-500">Loading preview…</div>}>
              <div className="">
                <DynamicPreview jsx={jsx} css={css} />
              </div>
            </Suspense>
          </div>
        ) : (
          <div className="p-6 text-slate-400">No component data in snapshot</div>
        )}
      </div>
    </div>
  );
};

export default SharedViewer;


