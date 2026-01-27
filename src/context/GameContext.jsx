import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [mode, setMode] = useState(null); 
  const [content, setContent] = useState(null); 
  const [stats, setStats] = useState(null); 
  const [sessionId, setSessionId] = useState(null);
  const [userId] = useState(() => Math.random().toString(36).substring(7));
  const [otherPlayer, setOtherPlayer] = useState(null); 
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <GameContext.Provider value={{ 
      mode, setMode, 
      content, setContent, 
      stats, setStats,
      sessionId, setSessionId,
      userId,
      otherPlayer, setOtherPlayer,
      socket
    }}>
      {children}
    </GameContext.Provider>
  );
};
