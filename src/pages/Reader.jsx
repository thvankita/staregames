import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Reader = () => {
  const navigate = useNavigate();
  const { content, setStats } = useGame();
  const [isReading, setIsReading] = useState(false);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  
  const timerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const streakStartTimeRef = useRef(null);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      pauseTimer();
    }, 15000); // 15 seconds of inactivity
  };

  useEffect(() => {
    if (!content) {
      navigate('/');
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseTimer();
      }
    };

    const handleBlur = () => pauseTimer();

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleScroll);
    window.addEventListener('keydown', handleScroll);
    window.addEventListener('touchstart', handleScroll);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleScroll);
      window.removeEventListener('keydown', handleScroll);
      window.removeEventListener('touchstart', handleScroll);
      clearInterval(timerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [content, navigate, isReading]);

  const startTimer = () => {
    if (isReading) return;
    setIsReading(true);
    streakStartTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setTotalFocusTime(prev => prev + 1);
      setCurrentStreak(Math.floor((Date.now() - streakStartTimeRef.current) / 1000));
    }, 1000);
    resetInactivityTimer();
  };

  const pauseTimer = () => {
    setIsReading(prev => {
      if (!prev) return prev;
      
      setBreakCount(b => b + 1);
      setLongestStreak(l => Math.max(l, currentStreak));
      setCurrentStreak(0);
      clearInterval(timerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      
      // Penalty: "Last few seconds of focus are deducted after each break"
      setTotalFocusTime(t => Math.max(0, t - 3));
      
      return false;
    });
  };

  const handleScroll = () => {
    if (!isReading) {
      startTimer();
    } else {
      resetInactivityTimer();
    }
    lastActivityRef.current = Date.now();
  };

  const handleFinish = () => {
    // Final update for stats before navigating
    const finalLongestStreak = Math.max(longestStreak, currentStreak);
    
    setStats({
      focusTime: totalFocusTime,
      breakCount: isReading ? breakCount : breakCount,
      longestStreak: finalLongestStreak
    });
    
    if (isReading) {
       clearInterval(timerRef.current);
       if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
    
    navigate('/summary');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 min-h-screen">
      <div className="prose prose-lg font-serif leading-relaxed text-[#333]">
        <h1 className="text-4xl mb-12 font-bold">{content?.title}</h1>
        <div className="whitespace-pre-wrap text-xl">
          {content?.text}
        </div>
      </div>
      
      <div className="fixed bottom-8 right-8">
        <button 
          onClick={handleFinish}
          className="bg-[#333] text-white py-2 px-6 rounded-none hover:bg-black transition-colors"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default Reader;
