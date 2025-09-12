// Element Selection Service - Handles robust element selection and management
import useChatbotComponentStore from '../store/chatbotComponentStore';

// Service state
const eventListeners = new Map();
let elementCache = new WeakMap();
let observer = null;
let isInitialized = false;

// Helper: normalize className/id to plain strings (handles SVGAnimatedString)
const toSafeClassName = (el) => {
  try {
    if (!el) {return ''};
    if (el.classList && typeof el.classList.value === 'string') {return el.classList.value};
    const cn = el.className;
    if (typeof cn === 'string') {return cn};
    if (cn && typeof cn.baseVal === 'string') {return cn.baseVal};
    return '';
  } catch { /* noop */ return '' }
};

const toSafeId = (el) => {
  try {
    if (!el) {return ''};
    const id = el.id;
    if (typeof id === 'string') {return id};
    if (id && typeof id.baseVal === 'string') {return id.baseVal};
    return '';
  } catch { /* noop */ return '' }
};

// Deterministic lightweight hash
const hashString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
};

// Assign a stable data-genui-id to an element if absent
const getOrAssignGenUiId = (el) => {
  if (!el) {return ''};
  const existing = el.getAttribute('data-genui-id');
  if (existing) {return existing};
  const parts = [
    el.tagName?.toLowerCase?.() || '',
    toSafeId(el),
    toSafeClassName(el),
  ];
  let p = el.parentElement;
  let depth = 0;
  while (p && depth < 2) {
    parts.push(p.tagName?.toLowerCase?.() || '', toSafeId(p), toSafeClassName(p));
    p = p.parentElement;
    depth++;
  }
  const uid = `g_${hashString(parts.join('|'))}`;
  try { el.setAttribute('data-genui-id', uid); } catch { /* noop */ }
  return uid;
};

// Tag all descendants in container
const tagContainer = (container) => {
  if (!container) {return};
  try {
    const all = container.querySelectorAll('*');
    all.forEach((node) => { getOrAssignGenUiId(node); });
  } catch { /* noop */ }
};

// Initialize the service
const initialize = () => {
  if (isInitialized) { return; }
  setupMutationObserver();
  isInitialized = true;
};

// Cleanup the service
const cleanup = () => {
  removeAllEventListeners();
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  elementCache = new WeakMap();
  isInitialized = false;
};

// Setup mutation observer to track DOM changes
const setupMutationObserver = () => {
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        validateSelectedElements();
      }
    });
  });
};

// Start observing a container for DOM changes
const observeContainer = (container) => {
  if (observer && container) {
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style', 'data-genui-id']
    });
  }
};

// Stop observing
const stopObserving = () => { if (observer) { observer.disconnect(); } };

// Generate a unique identifier for an element
const generateElementId = (element) => {
  const path = getElementPath(element);
  const content = element.textContent?.trim().substring(0, 20) || '';
  const classes = toSafeClassName(element);
  const id = toSafeId(element);
  return `${path}-${content}-${classes}-${id}`.replace(/\s+/g, '-').toLowerCase();
};

// Get element path for identification
const getElementPath = (element) => {
  const path = [];
  let current = element;
  let depth = 0;
  const maxDepth = 10;
  while (current && current !== document.body && depth < maxDepth) {
    let selector = current.tagName?.toLowerCase?.() || '';
    const curId = toSafeId(current);
    const curClass = toSafeClassName(current);
    if (curId) { selector += `#${curId}`; }
    else if (curClass) {
      const classes = curClass.split(' ').filter(Boolean).slice(0, 3).join('.');
      if (classes) { selector += `.${classes}`; }
    }
    if (current.parentElement) {
      const siblings = Array.from(current.parentElement.children);
      const index = siblings.indexOf(current);
      if (index > 0) { selector += `:nth-child(${index + 1})`; }
    }
    path.unshift(selector);
    current = current.parentElement;
    depth++;
  }
  return path.join(' > ');
};

// Get element attributes
const getElementAttributes = (element) => {
  const attributes = {};
  try {
    for (const attr of element.attributes) { attributes[attr.name] = attr.value; }
  } catch { /* noop */ }
  return attributes;
};

// Extract comprehensive element metadata
const extractElementMetadata = (element) => {
  if (!element || !element.tagName) { throw new Error('Invalid element provided'); }
  try {
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const uniqueId = generateElementId(element);
    const safeTag = element.tagName?.toLowerCase?.() || '';
    const safeClass = toSafeClassName(element);
    const safeId = toSafeId(element);
    const genUiId = getOrAssignGenUiId(element);
    const metadata = {
      element,
      uniqueId,
      genUiId,
      tagName: safeTag,
      className: safeClass,
      id: safeId,
      textContent: element.textContent?.trim().substring(0, 100),
      computedStyle: {
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight,
        padding: computedStyle.padding,
        margin: computedStyle.margin,
        border: computedStyle.border,
        borderRadius: computedStyle.borderRadius,
        display: computedStyle.display,
        position: computedStyle.position,
        width: computedStyle.width,
        height: computedStyle.height
      },
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      path: getElementPath(element),
      attributes: getElementAttributes(element),
      children: Array.from(element.children).map(child => ({
        tagName: child.tagName?.toLowerCase?.() || '',
        className: toSafeClassName(child),
        id: toSafeId(child),
        genUiId: child.getAttribute?.('data-genui-id') || ''
      })),
      parent: element.parentElement ? {
        tagName: element.parentElement.tagName?.toLowerCase?.() || '',
        className: toSafeClassName(element.parentElement),
        id: toSafeId(element.parentElement),
        genUiId: element.parentElement.getAttribute?.('data-genui-id') || ''
      } : null,
      timestamp: Date.now()
    };
    elementCache.set(element, metadata);
    return metadata;
  } catch { throw new Error('Failed to extract element metadata'); }
};

// Validate if selected elements still exist
const validateSelectedElements = () => {
  const store = useChatbotComponentStore.getState();
  if (store.selectedElement) {
    const isValid = isElementValid(store.selectedElement.element);
    if (!isValid) {
      // Do not surface UI error; log for debugging and mark invalid for silent recovery
      console.warn('Selected element was modified or removed');
      useChatbotComponentStore.setState({ isElementSelectionValid: false });
    }
  }
};

// Check if an element is still valid
const isElementValid = (element) => {
  if (!element) { return false; }
  try {
    if (!document.contains(element)) { return false; }
    const cached = elementCache.get(element);
    if (cached) {
      const currentPath = getElementPath(element);
      return currentPath === cached.path;
    }
    return true;
  } catch { return false }
};

// Find element by its metadata (for recovery)
const findElementByMetadata = (metadata) => {
  if (!metadata) {return null};
  try {
    if (metadata.genUiId) {
      const el = document.querySelector(`[data-genui-id="${metadata.genUiId}"]`);
      if (el) { return el }
    }
    if (metadata.path) {
      const elements = document.querySelectorAll(metadata.path);
      for (const element of elements) {
        if (matchesMetadata(element, metadata)) { return element }
      }
    }
  } catch { /* noop */ }
  return null;
};

// Check if element matches metadata
const matchesMetadata = (element, metadata) => {
  if (!element || !metadata) { return false }
  try {
    const idOk = !metadata.id || toSafeId(element) === metadata.id;
    const classOk = !metadata.className || toSafeClassName(element) === metadata.className;
    const tagOk = (element.tagName?.toLowerCase?.() || '') === metadata.tagName;
    const genOk = !metadata.genUiId || element.getAttribute('data-genui-id') === metadata.genUiId;
    return genOk || (idOk && classOk && tagOk);
  } catch { return false }
};

// Add event listeners with proper cleanup
const addEventListener = (container, eventType, handler, options = {}) => {
  if (!container) { return; }
  const key = `${container.id || 'default'}-${eventType}`;
  removeEventListener(container, eventType);
  container.addEventListener(eventType, handler, options);
  eventListeners.set(key, { container, eventType, handler, options });
};

// Remove specific event listener
const removeEventListener = (container, eventType) => {
  const key = `${container.id || 'default'}-${eventType}`;
  const listener = eventListeners.get(key);
  if (listener) {
    listener.container.removeEventListener(listener.eventType, listener.handler, listener.options);
    eventListeners.delete(key);
  }
};

// Remove all event listeners
const removeAllEventListeners = () => {
  eventListeners.forEach((listener) => {
    listener.container.removeEventListener(listener.eventType, listener.handler, listener.options);
  });
  eventListeners.clear();
};

// Highlight element with visual feedback
const highlightElement = (element, highlightClass = 'element-selected') => {
  if (!element) { return; }
  try {
    removeAllHighlights(highlightClass);
    getOrAssignGenUiId(element);
    element.classList.add(highlightClass);
    element.setAttribute('data-selected', 'true');
    if (element.scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } catch { /* noop */ }
};

// Remove highlight from element
const removeHighlight = (element, highlightClass = 'element-selected') => {
  if (!element) { return; }
  try {
    element.classList.remove(highlightClass);
    element.removeAttribute('data-selected');
  } catch { /* noop */ }
};

// Remove all highlights
const removeAllHighlights = (highlightClass = 'element-selected') => {
  try {
    const highlightedElements = document.querySelectorAll(`.${highlightClass}`);
    highlightedElements.forEach(element => { removeHighlight(element, highlightClass); });
  } catch { /* noop */ }
};

// Get element by unique ID
const getElementByUniqueId = (uniqueId) => {
  const elements = document.querySelectorAll('*');
  for (const element of elements) {
    const metadata = elementCache.get(element);
    if (metadata && metadata.uniqueId === uniqueId) { return element }
  }
  return null;
};

const elementSelectionService = {
  initialize,
  cleanup,
  observeContainer,
  stopObserving,
  extractElementMetadata,
  validateSelectedElements,
  isElementValid,
  findElementByMetadata,
  matchesMetadata,
  addEventListener,
  removeEventListener,
  removeAllEventListeners,
  highlightElement,
  removeHighlight,
  removeAllHighlights,
  getElementByUniqueId,
  getElementPath,
  getElementAttributes,
  generateElementId,
  getOrAssignGenUiId,
  tagContainer,
};

export default elementSelectionService;

