import axios from "axios";

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    // default frontend dev expects backend on port 8000 (backend .env), allow overrides via env
    return `${protocol}//${host}:8000`;
  }

  return "http://localhost:8000";
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
});

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

export { api, getApiBaseUrl, getAuthToken };
