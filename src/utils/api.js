import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:4000
  withCredentials: false,
});

// Helpers to persist tokens and session id
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const getSessionId = () => localStorage.getItem('sessionId');
export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};
export const setSessionId = (sessionId) => {
  if (sessionId) localStorage.setItem('sessionId', sessionId);
};
export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('sessionId');
};

// Request interceptor to add token + session header
api.interceptors.request.use(
  (config) => {
    const startedAt = Date.now();
    config.headers['X-Request-Started-At'] = startedAt;
    try {
      const method = (config.method || 'get').toUpperCase();
      const url = `${config.baseURL || ''}${config.url || ''}`;
      // Do not log tokens
      console.log(`[API ➜] ${method} ${url}`);
    } catch {
      // ignore logging errors
    }
    const token = getAccessToken();
    const sessionId = getSessionId();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (sessionId) {
      config.headers['X-Session-Id'] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    try {
      const method = (response.config?.method || 'get').toUpperCase();
      const url = `${response.config?.baseURL || ''}${response.config?.url || ''}`;
      const status = response.status;
      const startedAt = Number(response.config?.headers?.['X-Request-Started-At']);
      const ms = startedAt ? (Date.now() - startedAt) : null;
      console.log(`[API ✓] ${method} ${url} → ${status}${ms !== null ? ` (${ms} ms)` : ''}`);
    } catch {
      // ignore logging errors
    }
    return response;
  },
  async (error) => {
    try {
      const method = (error.config?.method || 'get').toUpperCase();
      const url = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
      const status = error.response?.status || 'ERR';
      console.warn(`[API ✗] ${method} ${url} → ${status}`);
    } catch {
      // ignore logging errors
    }
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';
    // Do not trigger refresh/redirect logic for login endpoint; let caller show message
    if (error.response && error.response.status === 401 && requestUrl.includes('/api/auth/login')) {
      return Promise.reject(error);
    }
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const rt = getRefreshToken();
      if (rt) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const newToken = await refreshToken();
          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          clearAuth();
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Unified response/error helpers
const handleApiResponse = (response) => {
  if (response.data && response.data.success !== undefined) {
    return response.data.data ?? response.data;
  }
  return response.data;
};

const handleApiError = (error) => {
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.message || error.response.data.error || 'An error occurred';
    throw new Error(errorMessage);
  }
  throw new Error(error.message || 'Network error occurred');
};

// Auth APIs
export const signup = async (payload) => {
  try {
    const res = await api.post('/api/auth/signup', payload);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const login = async (payload) => {
  try {
    const res = await api.post('/api/auth/login', payload);
    const data = handleApiResponse(res);
    if (data.accessToken) {localStorage.setItem('accessToken', data.accessToken);}
    if (data.refreshToken){ localStorage.setItem('refreshToken', data.refreshToken);}
    // Some backends may also return sessionId; store it if present
    if (data.sessionId) {setSessionId(data.sessionId);}
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch {
    // Ignore errors
  }
  clearAuth();
};

export const getProfile = async () => {
  try {
    const res = await api.get('/api/auth/profile');
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const refreshToken = async () => {
  const refreshTokenValue = getRefreshToken();
  const sessionId = getSessionId();
  
  if (!refreshTokenValue) {
    throw new Error('No refresh token');
  }
  try {
    const res = await api.post('/api/auth/refresh-token', { 
      refreshToken: refreshTokenValue,
      sessionId 
    });
    const data = handleApiResponse(res);
    
    // Update tokens and sessionId if provided
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.sessionId) {
      localStorage.setItem('sessionId', data.sessionId);
    }
    
    setTokens({ 
      accessToken: data.accessToken, 
      refreshToken: data.refreshToken,
      sessionId: data.sessionId 
    });
    
    return data.accessToken;
  } catch (error) {
    handleApiError(error);
  }
};

// Sessions
export const getSessions = async () => {
  try {
    const res = await api.get('/api/sessions');
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const getSessionById = async (sessionId) => {
  try {
    const res = await api.get(`/api/sessions/${sessionId}`);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const createSession = async (sessionData) => {
  try {
    const res = await api.post('/api/sessions', sessionData);
    const data = handleApiResponse(res);
    if (data?.id) {setSessionId(data.id);}
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateSession = async (sessionId, updateData) => {
  try {
    const res = await api.put(`/api/sessions/${sessionId}`, updateData);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteSession = async (sessionId) => {
  try {
    const res = await api.delete(`/api/sessions/${sessionId}`);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

// Conversations
export const listConversations = async () => {
  try {
    const res = await api.get('/api/conversations');
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const createConversation = async (payload) => {
  try {
    const res = await api.post('/api/conversations', payload);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const getConversation = async (conversationId) => {
  try {
    const res = await api.get(`/api/conversations/${conversationId}`);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const updateConversation = async (conversationId, payload) => {
  try {
    const res = await api.patch(`/api/conversations/${conversationId}`, payload);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const archiveConversation = async (conversationId) => {
  try {
    const res = await api.delete(`/api/conversations/${conversationId}`);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

// Messages (backend shape: POST /messages, GET /conversations/:id/messages)
export const listMessagesByConversation = async (conversationId) => {
  try {
    const res = await api.get(`/api/conversations/${conversationId}/messages`);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const createMessage = async (payload) => {
  try {
    const res = await api.post('/api/messages', payload);
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

// Backward-compatible helpers used elsewhere (no-ops mapped to new endpoints)
export const getSessionMessages = async (_sessionId, conversationId) => listMessagesByConversation(conversationId);
export const addSessionMessage = async (_sessionId, message) => createMessage(message);

// No direct backend routes for components/interactions/ai-responses were found in routes.
// Keep placeholders that post as messages with different types for storage as JSONB.
export const saveAIResponse = async (_sessionId, responseData) => {
  const payload = {
    conversationId: responseData.conversationId,
    role: 'ai',
    type: responseData.component?.jsx || responseData.component?.css ? 'jsx' : 'text',
    data: responseData.component?.jsx || responseData.component?.css
      ? { text: responseData.text || '', component: { jsx: responseData.component.jsx, css: responseData.component.css }, isEdited: false }
      : { text: responseData.text || '' },
  };
  return createMessage(payload);
};

export default api; 