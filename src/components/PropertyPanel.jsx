import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';

const PropertyPanel = ({ target, onChange, onClose }) => {
  const [localProps, setLocalProps] = useState({ ...target.props });
  const [localStyle, setLocalStyle] = useState({ ...target.style });
  const [content, setContent] = useState(target.content || '');
  const [showBgColor, setShowBgColor] = useState(false);
  const [showTextColor, setShowTextColor] = useState(false);

  useEffect(() => {
    setLocalProps({ ...target.props });
    setLocalStyle({ ...target.style });
    setContent(target.content || '');
  }, [target]);

  const update = (changes) => {
    const updated = {
      ...target,
      props: { ...localProps, ...changes.props },
      style: { ...localStyle, ...changes.style },
      content: changes.content !== undefined ? changes.content : content,
    };
    setLocalProps(updated.props);
    setLocalStyle(updated.style);
    if (changes.content !== undefined) {
      setContent(changes.content);
    }
    onChange(updated);
  };

  const getShadowPx = (shadow) => {
    if (!shadow) {
      return 0;
    }
    const match = shadow.match(/0 2px (\d+)px/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <div className="fixed z-50 bg-white shadow-xl rounded-lg p-4 border top-20 left-1/2 -translate-x-1/2 min-w-[320px] max-w-[90vw]" style={{ minWidth: 320 }}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg">Edit {target.type}</div>
        <button className="btn btn-sm btn-outline" onClick={onClose}> ✕</button>
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <input type="range" min="10" max="64" value={localStyle.fontSize !== undefined ? localStyle.fontSize : 16}
          onChange={e => update({ style: { fontSize: parseInt(e.target.value) } })}
        />
        <span className="ml-2 text-xs">{localStyle.fontSize !== undefined ? localStyle.fontSize : 16}px</span>
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input type="range" min="0" max="64" value={localStyle.padding !== undefined ? localStyle.padding : 8}
          onChange={e => update({ style: { padding: parseInt(e.target.value) } })}
        />
        <span className="ml-2 text-xs">{localStyle.padding !== undefined ? localStyle.padding : 8}px</span>
      </div>
      <div className="mb-3 flex gap-2 items-center">
        <label className="block text-sm font-medium">Background</label>
        <button className="w-6 h-6 rounded border" style={{ background: localStyle.background || '#fff' }}
          onClick={() => setShowBgColor(v => !v)} />
        {showBgColor && (
          <div className="absolute z-50 mt-2">
            <SketchPicker
              color={localStyle.background || '#fff'}
              onChange={c => update({ style: { background: c.hex } })}
            />
          </div>
        )}
        <label className="block text-sm font-medium ml-4">Text</label>
        <button className="w-6 h-6 rounded border" style={{ background: localStyle.color || '#222' }}
          onClick={() => setShowTextColor(v => !v)} />
        {showTextColor && (
          <div className="absolute z-50 mt-2">
            <SketchPicker
              color={localStyle.color || '#222'}
              onChange={c => update({ style: { color: c.hex } })}
            />
          </div>
        )}
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Text Content</label>
        <input type="text" className="input w-full" value={content}
          onChange={e => update({ content: e.target.value })}
        />
      </div>
      <div className="mb-3 flex gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Border</label>
          <input type="range" min="0" max="8" value={localStyle.borderWidth !== undefined ? localStyle.borderWidth : 1}
            onChange={e => update({ style: { borderWidth: parseInt(e.target.value) } })}
          />
          <span className="ml-2 text-xs">{localStyle.borderWidth !== undefined ? localStyle.borderWidth : 1}px</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Radius</label>
          <input type="range" min="0" max="32" value={localStyle.borderRadius !== undefined ? localStyle.borderRadius : 4}
            onChange={e => update({ style: { borderRadius: parseInt(e.target.value) } })}
          />
          <span className="ml-2 text-xs">{localStyle.borderRadius !== undefined ? localStyle.borderRadius : 4}px</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Shadow</label>
          <input type="range" min="0" max="24" value={getShadowPx(localStyle.boxShadow)}
            onChange={e => update({ style: { boxShadow: `0 2px ${e.target.value}px rgba(0,0,0,0.15)` } })}
          />
          <span className="ml-2 text-xs">{getShadowPx(localStyle.boxShadow)}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
