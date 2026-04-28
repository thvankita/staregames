<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { motion, useScroll, useSpring } from 'framer-motion';

const Reader = () => {
  const navigate = useNavigate();
  const { content, setStats, socket, sessionId, userId, mode, otherPlayer, setOtherPlayer } = useGame();
  const [startTime] = useState(() => Date.now());
  const [seconds, setSeconds] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69

  useEffect(() => {
    if (!content) {
      navigate('/');
      return;
    }

<<<<<<< HEAD
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
=======
    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const handleVisibilityChange = () => {
      const status = document.hidden ? 'away' : 'reading';
      if (socket && sessionId) {
        socket.emit('status-change', { sessionId, userId, status });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (socket && sessionId) {
      socket.emit('join-session', { sessionId, userId });

      socket.on('user-joined', ({ userId: joinedUserId }) => {
        if (joinedUserId !== userId) {
          setOtherPlayer({ userId: joinedUserId, status: 'reading' });
        }
      });

      socket.on('status-updated', ({ userId: updatedUserId, status }) => {
        if (updatedUserId !== userId) {
          setOtherPlayer(prev => prev ? { ...prev, status } : { userId: updatedUserId, status });
        }
      });

      socket.on('user-finished', ({ userId: finishedUserId, stats }) => {
        if (finishedUserId !== userId) {
          setOtherPlayer(prev => prev ? { ...prev, status: 'finished', stats } : { userId: finishedUserId, status: 'finished', stats });
        }
      });
    }

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (socket) {
        socket.off('user-joined');
        socket.off('status-updated');
        socket.off('user-finished');
      }
    };
  }, [content, navigate, socket, sessionId, userId, startTime, setOtherPlayer]);

  const handleFinish = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const finalStats = {
      timeSpent,
      accuracy: 100, // Placeholder
    };
    setStats(finalStats);
    
    if (socket && sessionId) {
      socket.emit('finish-session', { sessionId, userId, stats: finalStats });
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69
    }
    
    navigate('/summary');
  };

<<<<<<< HEAD
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
=======
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!content) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-black origin-left z-50"
        style={{ scaleX }}
      />

      {/* Header Info */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md z-40 flex items-center justify-between px-8">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Time Elapsing</span>
            <span className="font-mono font-bold text-lg">{formatTime(seconds)}</span>
          </div>
          {(mode === 'together' || mode === 'duel') && (
            <div className="flex flex-col border-l border-gray-100 pl-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Opponent Status</span>
              <span className="font-bold text-sm capitalize">
                {otherPlayer ? (
                  <span className={otherPlayer.status === 'finished' ? 'text-green-600' : 'text-blue-600'}>
                    {otherPlayer.status === 'finished' ? '🏁 Finished' : '📖 Reading...'}
                  </span>
                ) : 'Waiting for opponent...'}
              </span>
            </div>
          )}
        </div>
        <div className="text-sm font-bold text-gray-400 italic">
          "{content.title}"
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8 pt-32 pb-32 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg max-w-none"
        >
          <h1 className="text-5xl font-black mb-12 leading-tight tracking-tight">{content.title}</h1>
          <div className="text-xl leading-[1.8] text-gray-800 space-y-8 font-serif">
            {content.html ? (
              <div 
                className="prose-article"
                dangerouslySetInnerHTML={{ __html: content.html }} 
              />
            ) : (
              content.text ? content.text.split('\n').map((para, i) => (
                para.trim() && <p key={i} className="first-letter:text-3xl first-letter:font-bold">{para.trim()}</p>
              )) : "No content to display."
            )}
          </div>
        </motion.div>

        <div className="pt-24 flex flex-col items-center space-y-6">
          <div className="w-24 h-1 bg-gray-100 rounded-full" />
          <button
            onClick={handleFinish}
            className="group relative bg-black text-white py-6 px-16 rounded-2xl font-black text-xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            I'm Done Reading
          </button>
          <p className="text-gray-400 font-medium text-sm">Click only when you've fully absorbed the content.</p>
        </div>
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69
      </div>
    </div>
  );
};

export default Reader;
