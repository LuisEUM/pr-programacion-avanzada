import axios from "axios";
import { useSessionStore } from "@/store/session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

// Interceptor para agregar el token de autorización
api.interceptors.request.use((config) => {
  const session = useSessionStore();
  if (session.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const session = useSessionStore();
    if (error.response?.status === 401) {
      session.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
