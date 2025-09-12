import React, { useRef, useMemo, useCallback } from 'react';

// Parse Gemini API response to extract JSX and CSS
export const parseGeminiResponse = (response) => {
  try {
    const jsxMatch = response.match(/```jsx\s*([\s\S]*?)\s*```/);
    const cssMatch = response.match(/```css\s*([\s\S]*?)\s*```/);
    
    return {
      jsx: jsxMatch ? jsxMatch[1].trim() : '',
      css: cssMatch ? cssMatch[1].trim() : '',
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return { jsx: '', css: '' };
  }
};

// Convert file to base64
export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// Format selected element label for display
export const formatSelectedElementLabel = (selectedElement) => {
  if (!selectedElement) return '';
  
  const { tagName, className, id } = selectedElement;
  let label = tagName.toLowerCase();
  
  if (id) {
    label += `#${id}`;
  } else if (className) {
    label += `.${className.split(' ').join('.')}`;
  }
  
  return label;
};

// Abort controller hook for race condition protection
export const useAbortController = () => {
  const abortControllerRef = useRef(null);
  
  const createAbortController = useCallback(() => {
    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);
  
  return { createAbortController };
};

// Generate prompt text based on context
export const usePromptText = (userPrompt, code, selectedElement, editMode, isElementSelectionValid) => {
  return useMemo(() => {
    if (!userPrompt) return '';

    const hasExistingCode = Boolean(code?.jsx || code?.css);
    const isTargetedEdit = Boolean(editMode && selectedElement && isElementSelectionValid && hasExistingCode);

    if (!isTargetedEdit && !hasExistingCode) {
      return userPrompt;
    }

    const elementLabel = selectedElement ? formatSelectedElementLabel(selectedElement) : null;
    const elementPath = selectedElement?.path || null;

    const header = `You are editing an existing React component. Apply the requested changes to the current code.`;
    const targetBlock = elementLabel ? `Target element: ${elementLabel}${elementPath ? `\nDOM path: ${elementPath}` : ''}` : 'Global change to the component.';
    const instruction = `Requested change: ${userPrompt}`;

    const jsxBlock = code?.jsx ? `Current JSX:\n\u0060\u0060\u0060jsx\n${code.jsx}\n\u0060\u0060\u0060\n` : '';
    const cssBlock = code?.css ? `Current CSS:\n\u0060\u0060\u0060css\n${code.css}\n\u0060\u0060\u0060\n` : '';

    const outputRules = 'Output the FULL updated component code. Always return:\n- one ```jsx code block with the complete JSX\n- one ```css code block with the complete CSS';

    return [header, targetBlock, instruction, jsxBlock, cssBlock, outputRules].filter(Boolean).join('\n\n');
  }, [userPrompt, code?.jsx, code?.css, selectedElement, editMode, isElementSelectionValid]);
};

// Count components in store
export const useComponentCount = (components) => {
  return useMemo(() => {
    return components ? components.length : 0;
  }, [components]);
};

// Process messages for display
export const useProcessedMessages = (messages) => {
  return useMemo(() => {
    if (!messages || !Array.isArray(messages)) return [];
    
    return messages.map((message, index) => ({
      ...message,
      id: message.id || `msg-${index}`,
      timestamp: message.timestamp || new Date().toISOString(),
    }));
  }, [messages]);
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Download file with given content and filename
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
