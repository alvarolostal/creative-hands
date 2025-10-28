import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Esperar a que AuthContext haya terminado la verificación inicial (loading=false)
    // para evitar conectar un socket con un token que luego el servidor invalide y
    // provoque una desconexión inmediata.
    if (!loading && isAuthenticated && token) {
      const newSocket = io("http://localhost:5000", {
        auth: { token },
      });

      newSocket.on("connect", () => {
        console.log("✅ Socket conectado");
        setConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket desconectado");
        setConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Error de conexión:", error);
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      // Si aún está cargando o no hay token, asegurar que no haya sockets abiertos
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [isAuthenticated, token, loading]);

  const value = {
    socket,
    connected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
