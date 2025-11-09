import { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Usar sessionStorage para que cada pestaña/ventana tenga su propia sesión.
  // sessionStorage persiste al refrescar la misma pestaña, pero no se comparte
  // entre pestañas diferentes (comportamiento deseado para sesiones independientes).
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  // Configurar axios con el token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      sessionStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      sessionStorage.removeItem("token");
    }
  }, [token]);

  // Interceptor global para capturar 401 (token expirado / inválido)
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
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
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Verificar usuario al cargar
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
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
  const { data } = await api.post("/auth/register", userData);
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
      const { data } = await api.post("/auth/login", credentials);
      // Guardar token y establecer header de la instancia api inmediatamente
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      // Guardar en sessionStorage para que la autenticación sea independiente por pestaña
      sessionStorage.setItem("token", data.token);
      setToken(data.token);

      try {
        const { data: me } = await api.get("/auth/me");
        setUser(me.user);
        return { success: true };
      } catch (err) {
        // Si /me falla, limpiar estado y devolver error
        delete api.defaults.headers.common["Authorization"];
        sessionStorage.removeItem("token");
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
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    // Permite a componentes refrescar el usuario actual después de cambios
    refreshUser: async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (err) {
        console.error("Error refrescando usuario:", err);
      }
    },
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
