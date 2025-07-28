import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', // adjust as needed
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

export const getProfile = async () => {
  const res = await api.get('/api/auth/profile');
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem('refreshToken');
  if (!refreshTokenValue) {
    throw new Error('No refresh token');
  }
  const res = await api.post('/api/auth/refresh-token', { refreshToken: refreshTokenValue });
  console.log(JSON.stringify(res.data.data, null, 2));
  localStorage.setItem('accessToken', res.data.data.accessToken);
  if (res.data.data.refreshToken) {
    localStorage.setItem('refreshToken', res.data.data.refreshToken);
  }
  return res.data.data.accessToken;
};

export const getSessions = async () => {
  const res = await api.get('/api/sessions');
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

export const getSessionById = async (sessionId) => {
  const res = await api.get(`/api/sessions/${sessionId}`);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

export const createSession = async (sessionData) => {
  const res = await api.post('/api/sessions', sessionData);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

export const updateSession = async (sessionId, updateData) => {
  const res = await api.put(`/api/sessions/${sessionId}`, updateData);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

export const deleteSession = async (sessionId) => {
  const res = await api.delete(`/api/sessions/${sessionId}`);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

// Chat messages
export const getSessionMessages = async (sessionId) => {
  const res = await api.get(`/api/sessions/${sessionId}/messages`);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};
export const addSessionMessage = async (sessionId, message) => {
  const res = await api.post(`/api/sessions/${sessionId}/messages`, message);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

// Components
export const getSessionComponents = async (sessionId) => {
  const res = await api.get(`/api/sessions/${sessionId}/components`);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};
export const saveSessionComponent = async (sessionId, component) => {
  const res = await api.post(`/api/sessions/${sessionId}/components`, component);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

// AI Interactions
export const getSessionInteractions = async (sessionId) => {
  const res = await api.get(`/api/sessions/${sessionId}/interactions`);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};
export const saveSessionInteraction = async (sessionId, interaction) => {
  const res = await api.post(`/api/sessions/${sessionId}/interactions`, interaction);
  console.log(JSON.stringify(res.data.data, null, 2));
  return res.data.data;
};

export default api; 