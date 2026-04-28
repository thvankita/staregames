<<<<<<< HEAD
import React, { createContext, useContext, useState } from 'react';
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
<<<<<<< HEAD
  const [mode, setMode] = useState(null); // 'alone', 'together', 'duel'
  const [content, setContent] = useState(null); // { title, text, estimatedTime }
  const [stats, setStats] = useState(null); // { focusTime, breakCount, longestStreak }
  const [sessionId, setSessionId] = useState(null);
  const [userId] = useState(() => Math.random().toString(36).substring(7));
  const [otherPlayer, setOtherPlayer] = useState(null); // { userId, status, stats }
=======
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
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69

  return (
    <GameContext.Provider value={{ 
      mode, setMode, 
      content, setContent, 
      stats, setStats,
      sessionId, setSessionId,
      userId,
<<<<<<< HEAD
      otherPlayer, setOtherPlayer
=======
      otherPlayer, setOtherPlayer,
      socket
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69
    }}>
      {children}
    </GameContext.Provider>
  );
};
