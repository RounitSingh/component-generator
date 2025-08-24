import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL , // adjust as needed
  withCredentials: false, // set to true if using cookies for auth
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response && error.response.status === 401) && !originalRequest._retry) {
      if (localStorage.getItem('refreshToken')) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch(err => Promise.reject(err));
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
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleApiResponse = (response) => {
  if (response.data && response.data.success !== undefined) {
    return response.data.data || response.data;
  }
  return response.data;
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.message || error.response.data.error || 'An error occurred';
    throw new Error(errorMessage);
  }
  throw new Error(error.message || 'Network error occurred');
};

export const getProfile = async () => {
  try {
    const res = await api.get('/api/auth/profile');
    console.log('Profile response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem('refreshToken');
  if (!refreshTokenValue) {
    throw new Error('No refresh token');
  }
  try {
    const res = await api.post('/api/auth/refresh-token', { refreshToken: refreshTokenValue });
    console.log('Refresh token response:', JSON.stringify(res.data, null, 2));
    const data = handleApiResponse(res);
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data.accessToken;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSessions = async () => {
  try {
    const res = await api.get('/api/sessions');
    console.log('Sessions response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const getSessionById = async (sessionId) => {
  try {
    const res = await api.get(`/api/sessions/${sessionId}`);
    console.log('Session by ID response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const createSession = async (sessionData) => {
  try {
    const res = await api.post('/api/sessions', sessionData);
    console.log('Create session response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const updateSession = async (sessionId, updateData) => {
  try {
    const res = await api.put(`/api/sessions/${sessionId}`, updateData);
    console.log('Update session response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteSession = async (sessionId) => {
  try {
    const res = await api.delete(`/api/sessions/${sessionId}`);
    console.log('Delete session response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    handleApiError(error);
  }
};

// Chat messages
export const getSessionMessages = async (sessionId) => {
  try {
    const res = await api.get(`/api/sessions/${sessionId}/messages`);
    console.log('Get session messages response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to get session messages:', error);
    handleApiError(error);
  }
};

export const addSessionMessage = async (sessionId, message) => {
  try {
    const res = await api.post(`/api/sessions/${sessionId}/messages`, message);
    console.log('Add session message response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to add session message:', error);
    handleApiError(error);
  }
};

// Components
export const getSessionComponents = async (sessionId) => {
  try {
    const res = await api.get(`/api/sessions/${sessionId}/components`);
    console.log('Get session components response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to get session components:', error);
    handleApiError(error);
  }
};

export const saveSessionComponent = async (sessionId, component) => {
  try {
    const res = await api.post(`/api/sessions/${sessionId}/components`, component);
    console.log('Save session component response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to save session component:', error);
    handleApiError(error);
  }
};

// AI Interactions
export const getSessionInteractions = async (sessionId) => {
  try {
    const res = await api.get(`/api/sessions/${sessionId}/interactions`);
    console.log('Get session interactions response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to get session interactions:', error);
    handleApiError(error);
  }
};

export const saveSessionInteraction = async (sessionId, interaction) => {
  try {
    const res = await api.post(`/api/sessions/${sessionId}/interactions`, interaction);
    console.log('Save session interaction response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to save session interaction:', error);
    handleApiError(error);
  }
};

// AI Responses
export const saveAIResponse = async (sessionId, responseData) => {
  try {
    const res = await api.post(`/api/sessions/${sessionId}/ai-responses`, responseData);
    console.log('Save AI response response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to save AI response:', error);
    handleApiError(error);
  }
};

export const getSessionAIResponses = async (sessionId) => {
  try {
    const res = await api.get(`/api/sessions/${sessionId}/ai-responses`);
    console.log('Get session AI responses response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to get session AI responses:', error);
    handleApiError(error);
  }
};

// Conversation Sessions
export const getConversationSessions = async (sessionId) => {
  try {
    const res = await api.get(`/api/sessions/${sessionId}/conversations`);
    console.log('Get conversation sessions response:', JSON.stringify(res.data, null, 2));
    return handleApiResponse(res);
  } catch (error) {
    console.error('Failed to get conversation sessions:', error);
    handleApiError(error);
  }
};

export default api; 