
import axios from "axios";

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    // default frontend dev expects backend on port 8000
    return `${protocol}//${host}:8000`;
  }

  return "https://cinesocial-xzt4.onrender.com/";
};

const normalizeToken = (token) => {
  if (typeof token !== "string") return null;
  const trimmed = token.trim();
  if (!trimmed) return null;
  // Basic JWT sanity: three dot-separated parts
  const parts = trimmed.split('.');
  return parts.length === 3 ? trimmed : null;
};

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  const rawToken = localStorage.getItem("accesstoken") || localStorage.getItem("accessToken");
  return normalizeToken(rawToken);
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Include cookies in requests for refresh token mechanism
});

// Track if we're currently refreshing the token to prevent multiple refresh calls
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
  
  isRefreshing = false;
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token refresh is already in progress, queue this request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint to get new access token
        // NOTE: backend mounts auth routes under /api/auth
        // Include refresh token from localStorage as a fallback for development environments
        const storedRefresh = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        const response = await axios.post(
          `${getApiBaseUrl()}/api/auth/refresh`,
          { refreshToken: storedRefresh || null },
          { withCredentials: true } // Include cookies (refresh token)
        );

        const { accessToken } = response.data;

        // Debug
        console.debug('Token refresh succeeded, new access token received');

        // Store the new access token (store under both common keys for compatibility)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("accesstoken", accessToken);

        // Update the authorization header with new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Process the queue of failed requests
        processQueue(null, accessToken);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, attempt a cookie-only retry (in case server set httpOnly cookie but body fallback missing)
        console.warn('First refresh attempt failed:', refreshError?.response?.data || refreshError.message || refreshError);
        try {
          const cookieOnly = await axios.post(
            `${getApiBaseUrl()}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );
          const cookieAccess = cookieOnly.data?.accessToken;
          if (cookieAccess) {
            console.debug('Cookie-only refresh succeeded');
            localStorage.setItem('accessToken', cookieAccess);
            localStorage.setItem('accesstoken', cookieAccess);
            originalRequest.headers['Authorization'] = `Bearer ${cookieAccess}`;
            processQueue(null, cookieAccess);
            return api(originalRequest);
          }
        } catch (cookieErr) {
          console.warn('Cookie-only refresh also failed:', cookieErr?.response?.data || cookieErr.message || cookieErr);
        }

        // Both refresh attempts failed — process queue with error
        processQueue(refreshError, null);

        // Clear storage and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/Login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api, getApiBaseUrl, getAuthToken };
