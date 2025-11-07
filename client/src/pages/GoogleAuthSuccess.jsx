import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "lucide-react";

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Guardar el token
      localStorage.setItem("token", token);

      // Actualizar el contexto de autenticación
      login(token);

      // Redirigir al home o a la página anterior
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } else {
      // Si no hay token, redirigir al login
      navigate("/login?error=auth_failed");
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-500 via-primary-50 to-light-500 dark:from-dark-500 dark:via-dark-400 dark:to-dark-600">
      <div className="text-center">
        <Loader className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Iniciando sesión...
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
