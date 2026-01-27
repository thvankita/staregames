import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

const Summary = () => {
  const navigate = useNavigate();
  const { stats, otherPlayer, mode } = useGame();

  const reflectiveSentences = [
    "You stayed longer than most people.",
    "The middle was the hardest.",
    "You always came back.",
    "Your focus improved after the first session.",
    "The depth of your focus is increasing.",
    "Each session is a victory over distraction."
  ];

  const [randomSentence] = useState(() => reflectiveSentences[Math.floor(Math.random() * reflectiveSentences.length)]);

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const isWinner = mode === 'duel' && otherPlayer?.status === 'finished' 
    ? stats?.timeSpent < (otherPlayer?.stats?.timeSpent || Infinity)
    : true;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-7xl font-black tracking-tighter mb-4">
            {mode === 'duel' ? (isWinner ? 'YOU WON.' : 'YOU LOST.') : 'YOU FOCUSED.'}
          </h2>
          {mode === 'duel' && (
            <p className="text-xl text-gray-500 font-bold uppercase tracking-widest">
              {isWinner ? 'Speed & Focus combined.' : 'The opponent was faster this time.'}
            </p>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-20">
          <motion.div variants={itemVariants} className="bg-[#111] p-12 space-y-4 border border-white/5 rounded-3xl">
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Your Time</p>
            <p className="text-6xl font-mono font-bold tracking-tighter text-white">{formatTime(stats?.timeSpent)}</p>
          </motion.div>
          
          {(mode === 'together' || mode === 'duel') && (
            <motion.div variants={itemVariants} className="bg-[#111] p-12 space-y-4 border border-white/5 rounded-3xl">
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Opponent's Time</p>
              <p className="text-6xl font-mono font-bold tracking-tighter text-gray-400">
                {otherPlayer?.stats?.timeSpent ? formatTime(otherPlayer.stats.timeSpent) : 'Still reading...'}
              </p>
            </motion.div>
          )}
        </div>

        <motion.div variants={itemVariants} className="text-center space-y-12">
          <p className="text-3xl font-serif italic text-gray-400 max-w-2xl mx-auto leading-relaxed">
            “{randomSentence}”
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={() => {
                window.location.href = '/'; // Full refresh to reset state
              }}
              className="w-full md:w-auto bg-white text-black py-5 px-16 font-black text-xl hover:bg-gray-200 transition-all active:scale-95 rounded-2xl"
            >
              Start New Session
            </button>
            <button className="w-full md:w-auto border-2 border-white/20 text-white py-5 px-16 font-black text-xl hover:border-white transition-all active:scale-95 rounded-2xl">
              Share Result
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Summary;
