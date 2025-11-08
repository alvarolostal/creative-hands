import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import apiClient from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Configurar axios base para autenticación (sin interceptor)
const baseURL = import.meta.env.VITE_API_URL || "/api";
const authAxios = axios.create({
  baseURL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Usar sessionStorage para que cada pestaña/ventana tenga su propia sesión.
  // sessionStorage persiste al refrescar la misma pestaña, pero no se comparte
  // entre pestañas diferentes (comportamiento deseado para sesiones independientes).
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  // Guardar token en sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
  }, [token]);

  // Interceptor global para capturar 401 (token expirado / inválido)
  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        if (status === 401) {
          // Token inválido o expirado: limpiar estado local y redirigir al login
          setToken(null);
          setUser(null);
          try {
            // Redirigimos a la página de login para que el usuario vuelva a autenticarse
            window.location.replace("/login");
          } catch (e) {
            // en entornos sin window (tests) lo ignoramos
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Verificar usuario al cargar
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const { data } = await apiClient.get("/api/auth/me");
          setUser(data.user);
        } catch (error) {
          console.error("Error al verificar autenticación:", error);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const register = async (userData) => {
    try {
      const { data } = await authAxios.post("/api/auth/register", userData);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrarse",
      };
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await authAxios.post("/api/auth/login", credentials);
      // Guardar token en estado y sessionStorage
      setToken(data.token);

      try {
        const { data: me } = await apiClient.get("/api/auth/me");
        setUser(me.user);
        return { success: true };
      } catch (err) {
        // Si /me falla, limpiar estado y devolver error
        setToken(null);
        setUser(null);
        return {
          success: false,
          message:
            err.response?.data?.message ||
            "Error al verificar usuario después del login",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
