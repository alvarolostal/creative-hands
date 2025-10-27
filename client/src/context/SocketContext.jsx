import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket conectado');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket desconectado');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [isAuthenticated, token]);

  const value = {
    socket,
    connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};