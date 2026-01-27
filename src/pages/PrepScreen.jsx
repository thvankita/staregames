import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

const PrepScreen = () => {
  const navigate = useNavigate();
  const { content, sessionId, mode } = useGame();

  useEffect(() => {
    if (!content) {
      navigate('/');
    }
  }, [content, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#fafafa]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4"
          >
            Session Ready
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black tracking-tight text-gray-900"
          >
            {content?.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-500 font-medium"
          >
            {content?.estimatedTime} focusing required
          </motion.p>
        </div>
        
        {(mode === 'together' || mode === 'duel') && sessionId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white border-2 border-black p-6 rounded-2xl space-y-2"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Share this code with your friend</p>
            <p className="text-3xl font-mono font-black tracking-widest">{sessionId}</p>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="py-12 border-y border-gray-100"
        >
          <p className="text-3xl font-serif italic text-gray-800 leading-relaxed">
            “The world disappears when you focus.”
          </p>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => navigate('/read')}
          className="group relative bg-black text-white py-5 px-16 overflow-hidden font-black text-xl transition-all rounded-xl shadow-2xl shadow-black/20"
        >
          <div className="absolute inset-0 w-0 bg-gray-800 transition-all duration-[250ms] ease-out group-hover:w-full" />
          <span className="relative">Start Session</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PrepScreen;
