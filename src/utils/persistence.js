// Persistence utilities for AI Editor

// Convert backend message format to frontend format
export const convertBackendMessageToFrontend = (backendMessage) => {
  return {
    id: backendMessage.id,
    type: backendMessage.role === 'user' ? 'prompt' : 'response',
    text: backendMessage.content,
    image: backendMessage.metadata?.image || null,
    timestamp: backendMessage.created_at,
    conversationId: backendMessage.conversation_id,
    messageOrder: backendMessage.message_order,
    metadata: backendMessage.metadata || {},
  };
};

// Convert frontend message format to backend format
export const convertFrontendMessageToBackend = (frontendMessage) => {
  return {
    role: frontendMessage.type === 'prompt' ? 'user' : 'assistant',
    content: frontendMessage.text,
    messageType: frontendMessage.image ? 'image' : 'text',
    conversationId: frontendMessage.conversationId,
    metadata: frontendMessage.image ? { image: frontendMessage.image } : frontendMessage.metadata || {},
  };
};

// Convert backend component format to frontend format
export const convertBackendComponentToFrontend = (backendComponent) => {
  return {
    id: backendComponent.id,
    name: backendComponent.name,
    jsxCode: backendComponent.jsx_code,
    cssCode: backendComponent.css_code,
    componentType: backendComponent.component_type,
    metadata: backendComponent.metadata || {},
    isCurrent: backendComponent.is_current,
    createdAt: backendComponent.created_at,
    updatedAt: backendComponent.updated_at,
  };
};

// Convert frontend component format to backend format
export const convertFrontendComponentToBackend = (frontendComponent) => {
  return {
    name: frontendComponent.name,
    jsxCode: frontendComponent.jsxCode,
    cssCode: frontendComponent.cssCode,
    componentType: frontendComponent.componentType || 'component',
    metadata: frontendComponent.metadata || {},
  };
};

// Convert backend interaction format to frontend format
export const convertBackendInteractionToFrontend = (backendInteraction) => {
  return {
    id: backendInteraction.id,
    prompt: backendInteraction.prompt,
    response: backendInteraction.response,
    interactionType: backendInteraction.interaction_type,
    targetElement: backendInteraction.target_element,
    conversationId: backendInteraction.conversation_id,
    relatedMessageId: backendInteraction.related_message_id,
    metadata: backendInteraction.metadata || {},
    createdAt: backendInteraction.created_at,
  };
};

// Convert frontend interaction format to backend format
export const convertFrontendInteractionToBackend = (frontendInteraction) => {
  return {
    prompt: frontendInteraction.prompt,
    response: frontendInteraction.response,
    interactionType: frontendInteraction.interactionType,
    targetElement: frontendInteraction.targetElement || null,
    conversationId: frontendInteraction.conversationId,
    relatedMessageId: frontendInteraction.relatedMessageId || null,
    metadata: frontendInteraction.metadata || {},
  };
};

// Batch convert arrays of data
export const convertBackendMessagesToFrontend = (backendMessages) => {
  return (backendMessages || []).map(convertBackendMessageToFrontend);
};

export const convertBackendComponentsToFrontend = (backendComponents) => {
  return (backendComponents || []).map(convertBackendComponentToFrontend);
};

export const convertBackendInteractionsToFrontend = (backendInteractions) => {
  return (backendInteractions || []).map(convertBackendInteractionToFrontend);
};

// Convert backend AI response format to frontend format
export const convertBackendAIResponseToFrontend = (backendResponse) => {
  return {
    id: backendResponse.id,
    conversationId: backendResponse.conversation_id,
    userMessageId: backendResponse.user_message_id,
    promptText: backendResponse.prompt_text,
    responseText: backendResponse.response_text,
    modelName: backendResponse.model_name,
    responseTimeMs: backendResponse.response_time_ms,
    tokensUsed: backendResponse.tokens_used,
    metadata: backendResponse.metadata || {},
    createdAt: backendResponse.created_at,
  };
};

// Convert frontend AI response format to backend format
export const convertFrontendAIResponseToBackend = (frontendResponse) => {
  return {
    conversationId: frontendResponse.conversationId,
    userMessageId: frontendResponse.userMessageId || null,
    promptText: frontendResponse.promptText,
    responseText: frontendResponse.responseText,
    modelName: frontendResponse.modelName || 'gemini',
    responseTimeMs: frontendResponse.responseTimeMs || null,
    tokensUsed: frontendResponse.tokensUsed || null,
    metadata: frontendResponse.metadata || {},
  };
};

// Convert backend conversation session format to frontend format
export const convertBackendConversationSessionToFrontend = (backendConversation) => {
  return {
    id: backendConversation.id,
    conversationId: backendConversation.conversation_id,
    startedAt: backendConversation.started_at,
    lastActivity: backendConversation.last_activity,
    messageCount: backendConversation.message_count,
    metadata: backendConversation.metadata || {},
  };
};

// Batch convert arrays of data
export const convertBackendAIResponsesToFrontend = (backendResponses) => {
  return (backendResponses || []).map(convertBackendAIResponseToFrontend);
};

export const convertBackendConversationSessionsToFrontend = (backendConversations) => {
  return (backendConversations || []).map(convertBackendConversationSessionToFrontend);
};

// Persistence status tracking
export const createPersistenceStatus = () => ({
  isSaving: false,
  lastSaved: null,
  error: null,
});

// Update persistence status
export const updatePersistenceStatus = (status, updates) => ({
  ...status,
  ...updates,
});

// Local storage utilities for offline support
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
    return false;
  }
};

// Session-specific storage keys
export const getSessionStorageKey = (sessionId, type) => {
  return `ai-editor-${sessionId}-${type}`;
};

// Save session data locally as backup
export const saveSessionDataLocally = (sessionId, data) => {
  const key = getSessionStorageKey(sessionId, 'backup');
  return saveToLocalStorage(key, {
    ...data,
    timestamp: Date.now(),
  });
};

// Load session data from local backup
export const loadSessionDataLocally = (sessionId) => {
  const key = getSessionStorageKey(sessionId, 'backup');
  return loadFromLocalStorage(key);
};

// Clear session data from local storage
export const clearSessionDataLocally = (sessionId) => {
  const key = getSessionStorageKey(sessionId, 'backup');
  return removeFromLocalStorage(key);
};
