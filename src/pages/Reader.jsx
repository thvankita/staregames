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

  useEffect(() => {
    if (!content) {
      navigate('/');
      return;
    }

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
    }
    
    navigate('/summary');
  };

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
      </div>
    </div>
  );
};

export default Reader;
