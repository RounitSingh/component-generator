import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { debounce, throttle, cloneDeep, isEmpty, isEqual } from 'lodash-es';
import { format, parseISO, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import useChatbotComponentStore from '../store/chatbotComponentStore';
import elementSelectionService from '../utils/elementSelectionService';


const getIcon = (iconName) => {
  if (!iconName || typeof iconName !== 'string') {
    return LucideIcons.AlertCircle || (() => <span>⚠️</span>);
  }
  
  if (LucideIcons[iconName]) {
    return LucideIcons[iconName];
  }
  
  const variations = [
    iconName,
    iconName.charAt(0).toUpperCase() + iconName.slice(1),
    iconName.toUpperCase(),
    iconName.toLowerCase(),
    iconName.replace(/([A-Z])/g, '-$1').toLowerCase(),
    iconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  ];
  
  for (const variation of variations) {
    if (LucideIcons[variation]) {
      return LucideIcons[variation];
    }
  }
  
  return LucideIcons.AlertCircle || (() => <span>⚠️ {iconName}</span>);
};

const scope = { 
  React, 
  useState: React.useState, 
  useEffect: React.useEffect,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useRef: React.useRef,
  useContext: React.useContext,
  useReducer: React.useReducer,
  
  ...LucideIcons,
  
  Icon: getIcon,
  getIcon,
  
  debounce,
  throttle,
  cloneDeep,
  isEmpty,
  isEqual,
  format,
  parseISO,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  
  useForm,
  Controller,
  yup,
  
  motion,
  AnimatePresence,
  
  console,
  alert,
  confirm,
  prompt,
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  
  localStorage,
  sessionStorage,
  navigator,
  window,
  document,
  
  Math,
  Date,
  JSON,
  Array,
  Object,
  String,
  Number,
  Boolean,
  
  style: (styles) => styles
};

const preprocessCode = (code) => {
  try {
    let cleaned = code
      .replace(/^[ \t]*import[^;]*;?$/gm, '')
      .replace(/^[ \t]*export[^;]*;?$/gm, '')
      .replace(/export\s+default\s+/g, '');

    cleaned = cleaned.replace(
      /function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*{([\s\S]*?)}\s*(?=<|$)/g,
      (match, name, params, body) => {
        return `const ${name} = (${params}) => {${body}}`;
      }
    );

    cleaned = cleaned.replace(/;+\s*\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    const match = cleaned.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/);
    if (match) {
      const componentName = match[1];
      const renderRegex = new RegExp(`<${componentName} ?/?>`);
      if (!renderRegex.test(cleaned)) {
        cleaned += `\n\nrender(<${componentName} />)`;
      }
    }

    return { code: cleaned, error: null };
  } catch (err) {
    return { code: '', error: err.message };
  }
};

const preprocessCSS = (css) => {
  if (!css || typeof css !== 'string') {
    return '';
  }

  let processedCSS = css;

  const resetCSS = `
    [data-live-preview] {
      all: initial;
      box-sizing: border-box;
      font-family: inherit;
      line-height: inherit;
      color: inherit;
      background: transparent;
      margin: 0;
      padding: 0;
      border: none;
      outline: none;
      text-decoration: none;
      list-style: none;
      display: block;
      position: relative;
      width: 100%;
      height: auto;
      max-height: 100vh;
      overflow: visible;
    }
    
    [data-live-preview] * {
      box-sizing: border-box;
    }
    
    [data-live-preview] .preview-content-wrapper {
      position: relative;
      width: 100%;
      height: auto;
      max-height: 100vh;
      min-height: 100px;
      overflow: visible;
    }
  `;

  processedCSS = `${resetCSS}\n${processedCSS}`;

  return processedCSS;
};

const injectCSS = (css) => {
  const existing = document.getElementById('live-preview-style');
  if (existing) { 
    existing.remove();
  }

  if (!css || typeof css !== 'string') {
    return;
  }

  const preprocessedCSS = preprocessCSS(css);
  
  const scopedCss = preprocessedCSS.replace(/(^|\})\s*([^{]+)/g, (match, brace, selector) => {
    const trimmedSelector = selector.trim();
    
    if (trimmedSelector.startsWith('@')) {
      return match;
    }
    
    if (trimmedSelector.includes('html') || trimmedSelector.includes('body')) {
      return match;
    }
    
    if (trimmedSelector.includes('*')) {
      return `${brace} [data-live-preview] ${selector}`;
    }
    
    return `${brace} [data-live-preview] ${selector}`;
  });

  const style = document.createElement('style');
  style.id = 'live-preview-style';
  style.textContent = scopedCss;
  document.head.appendChild(style);
};

const DynamicPreview = ({ jsx, css }) => {
  const { 
    editMode, 
    selectedElement, 
    setSelectedElement, 
    isElementSelectionValid,
    validateSelectedElement
  } = useChatbotComponentStore();

  React.useEffect(() => {
    injectCSS(css);
  }, [css]);

  const { code: processedCode, error: preprocessError } = preprocessCode(jsx);

  React.useEffect(() => {
    const previewContainer = document.querySelector('[data-live-preview]');
    if (previewContainer) {
      elementSelectionService.tagContainer(previewContainer);
    }
  }, [processedCode]);

  React.useEffect(() => {
    elementSelectionService.initialize();
    return () => { elementSelectionService.cleanup(); };
  }, []);

  React.useEffect(() => {
    if (!editMode) {
      elementSelectionService.removeAllHighlights();
      elementSelectionService.stopObserving();
      return;
    }

    const handleRightClick = (e) => {
      e.preventDefault();
      const target = e.target;
      const previewContainer = target.closest('[data-live-preview]');
      if (previewContainer) {
        try {
          const elementData = elementSelectionService.extractElementMetadata(target);
          setSelectedElement(elementData);
          elementSelectionService.highlightElement(target);
        } catch { /* noop */ }
      }
    };

    const previewContainer = document.querySelector('[data-live-preview]');
    if (previewContainer) {
      elementSelectionService.tagContainer(previewContainer);
      previewContainer.classList.add('edit-mode-active');
      elementSelectionService.addEventListener(previewContainer, 'contextmenu', handleRightClick);
      elementSelectionService.observeContainer(previewContainer);
      return () => {
        previewContainer.classList.remove('edit-mode-active');
        elementSelectionService.removeEventListener(previewContainer, 'contextmenu');
        elementSelectionService.stopObserving();
      };
    }
    return undefined;
  }, [editMode, setSelectedElement]);

  React.useEffect(() => {
    if (editMode && selectedElement) {
      const intervalId = setInterval(() => { validateSelectedElement(); }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [editMode, selectedElement, validateSelectedElement]);

  React.useEffect(() => {
    if (!editMode || !selectedElement || isElementSelectionValid) {return};
    const el = elementSelectionService.findElementByMetadata(selectedElement);
    if (el) {
      const meta = elementSelectionService.extractElementMetadata(el);
      setSelectedElement(meta);
      elementSelectionService.highlightElement(el);
    }
  }, [editMode, selectedElement, isElementSelectionValid, setSelectedElement]);

  React.useEffect(() => () => {
    elementSelectionService.removeAllHighlights();
    elementSelectionService.stopObserving();
  }, []);

  return (
    <LiveProvider code={processedCode} scope={scope} noInline>
      <div className="grid grid-cols-1 gap-4">
        <div 
          className="  relative overflow-hidden" 
          data-live-preview
          style={{
            isolation: 'isolate',
            contain: 'layout style paint',
            position: 'relative'
          }}
        >
          <div 
            className="preview-content-wrapper"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
             
             
              overflow: 'auto'
            }}
          >
            <LivePreview className="" />
          </div>
          <LiveError className="text-red-600" />
          {preprocessError && <div className="text-red-500">{preprocessError}</div>}
                      {editMode && (
              <div className="absolute  top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-lg shadow-emerald-400 text-xs font-medium z-100">
                Edit Mode
              </div>
            )}
        
        </div>
      </div>
    </LiveProvider>
  );
};

export default DynamicPreview;