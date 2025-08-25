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

// Dynamic icon resolver function
const getIcon = (iconName) => {
  // Handle invalid input
  if (!iconName || typeof iconName !== 'string') {
    return LucideIcons.AlertCircle || (() => <span>⚠️</span>);
  }
  
  // Try Lucide icons first (most common)
  if (LucideIcons[iconName]) {
    return LucideIcons[iconName];
  }
  
  // Try with different naming conventions
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
  
  // Return a fallback icon if not found
  return LucideIcons.AlertCircle || (() => <span>⚠️ {iconName}</span>);
};

// Create a comprehensive scope with all the libraries
const scope = { 
  // React core
  React, 
  useState: React.useState, 
  useEffect: React.useEffect,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useRef: React.useRef,
  useContext: React.useContext,
  useReducer: React.useReducer,
  
  // Icons - Lucide (all available)
  ...LucideIcons,
  
  // Dynamic icon resolver
  Icon: getIcon,
  getIcon,
  
  // Utility libraries
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
  
  // Form libraries
  useForm,
  Controller,
  yup,
  
  // Animation libraries
  motion,
  AnimatePresence,
  
  // Common utility functions
  console,
  alert,
  confirm,
  prompt,
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  
  // Browser APIs
  localStorage,
  sessionStorage,
  navigator,
  window,
  document,
  
  // Math utilities
  Math,
  Date,
  JSON,
  Array,
  Object,
  String,
  Number,
  Boolean,
  
  // CSS utilities (for inline styles)
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

const injectCSS = (css) => {
  const existing = document.getElementById('live-preview-style');
  if (existing) { 
    existing.remove();
  }

  const style = document.createElement('style');
  style.id = 'live-preview-style';
  style.textContent = css || '';
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

  // Tag nodes after render to stabilize recovery
  React.useEffect(() => {
    const previewContainer = document.querySelector('[data-live-preview]');
    if (previewContainer) {
      elementSelectionService.tagContainer(previewContainer);
    }
  }, [processedCode]);

  // Initialize element selection service
  React.useEffect(() => {
    elementSelectionService.initialize();
    return () => { elementSelectionService.cleanup(); };
  }, []);

  // Handle element selection with robust service
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

  // Validate selected element periodically (recovery is silent)
  React.useEffect(() => {
    if (editMode && selectedElement) {
      const intervalId = setInterval(() => { validateSelectedElement(); }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [editMode, selectedElement, validateSelectedElement]);

  // Auto-recover selection if invalid after DOM updates
  React.useEffect(() => {
    if (!editMode || !selectedElement || isElementSelectionValid) {return};
    const el = elementSelectionService.findElementByMetadata(selectedElement);
    if (el) {
      const meta = elementSelectionService.extractElementMetadata(el);
      setSelectedElement(meta);
      elementSelectionService.highlightElement(el);
    }
  }, [editMode, selectedElement, isElementSelectionValid, setSelectedElement]);

  // Cleanup effect when component unmounts
  React.useEffect(() => () => {
    elementSelectionService.removeAllHighlights();
    elementSelectionService.stopObserving();
  }, []);

  return (
    <LiveProvider code={processedCode} scope={scope} noInline>
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-gray-100 rounded-md border border-gray-300 relative" data-live-preview>
          <LivePreview className="mb-2" />
          <LiveError className="text-red-600" />
          {preprocessError && <div className="text-red-500">{preprocessError}</div>}
          {editMode && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
              Edit Mode
            </div>
          )}
          {/*{editMode && selectedElement && isElementSelectionValid && (
            <div className="absolute bottom-2 left-2 bg-white border border-gray-300 rounded p-2 text-xs max-w-xs shadow-lg">
              <div className="font-medium text-gray-700 mb-1">Selected Element:</div>
              <div className="text-gray-600 font-mono">{selectedElement.tagName}</div>
              {selectedElement.className && (
                <div className="text-gray-500 text-xs">Class: {selectedElement.className}</div>
              )}
              {selectedElement.id && (
                <div className="text-gray-500 text-xs">ID: {selectedElement.id}</div>
              )}
              {selectedElement.textContent && (
                <div className="text-gray-500 text-xs truncate">Text: {selectedElement.textContent}</div>
              )}
            </div>
          )} */}
        </div>
      </div>
    </LiveProvider>
  );
};

export default DynamicPreview;
