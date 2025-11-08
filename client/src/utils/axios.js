import axios from "axios";

// Configurar baseURL según el entorno
// En desarrollo, usar el proxy de Vite (/api)
// En producción, usar la URL completa del backend
const baseURL =
  import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || "/api")
    : "/api";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor para añadir el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
