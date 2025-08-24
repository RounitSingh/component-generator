import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { debounce, throttle, cloneDeep, isEmpty, isEqual } from 'lodash-es';
import { format, parseISO, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';

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
  React.useEffect(() => {
    injectCSS(css);
  }, [css]);

  const { code: processedCode, error: preprocessError } = preprocessCode(jsx);

  // Add a simple test to verify all libraries are available
  React.useEffect(() => {
    if (window && window.testLibraries) {
      console.log('✅ All libraries loaded successfully:', {
        lucide: !!LucideIcons.Heart,
        
        lodash: !!debounce,
        dateFns: !!format,
        framerMotion: !!motion,
        reactHookForm: !!useForm,
        yup: !!yup
      });
    }
  }, []);

  return (
    <LiveProvider code={processedCode} scope={scope} noInline>
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-gray-100 rounded-md border border-gray-300">
          <LivePreview className="mb-2" />
          <LiveError className="text-red-600" />
          {preprocessError && <div className="text-red-500">{preprocessError}</div>}
        </div>
      </div>
    </LiveProvider>
  );
};

export default DynamicPreview;
