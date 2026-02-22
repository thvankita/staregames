import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [mode, setMode] = useState(null); // 'alone', 'together', 'duel'
  const [content, setContent] = useState(null); // { title, text, estimatedTime }
  const [stats, setStats] = useState(null); // { focusTime, breakCount, longestStreak }
  const [sessionId, setSessionId] = useState(null);
  const [userId] = useState(() => Math.random().toString(36).substring(7));
  const [otherPlayer, setOtherPlayer] = useState(null); // { userId, status, stats }

  return (
    <GameContext.Provider value={{ 
      mode, setMode, 
      content, setContent, 
      stats, setStats,
      sessionId, setSessionId,
      userId,
      otherPlayer, setOtherPlayer
    }}>
      {children}
    </GameContext.Provider>
  );
};
