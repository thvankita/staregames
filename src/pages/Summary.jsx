import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Summary = () => {
  const navigate = useNavigate();
  const { stats } = useGame();

  const reflectiveSentences = [
    "You stayed longer than most people.",
    "The middle was the hardest.",
    "You always came back.",
    "Your focus improved after the first break."
  ];

  const randomSentence = reflectiveSentences[Math.floor(Math.random() * reflectiveSentences.length)];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-4xl font-bold mb-12">Session Complete</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 w-full max-w-4xl">
        <div className="space-y-2">
          <p className="text-gray-500 uppercase tracking-widest text-sm">True Focus Time</p>
          <p className="text-4xl font-bold">{formatTime(stats?.focusTime || 0)}</p>
        </div>
        <div className="space-y-2">
          <p className="text-gray-500 uppercase tracking-widest text-sm">Break Count</p>
          <p className="text-4xl font-bold">{stats?.breakCount || 0}</p>
        </div>
        <div className="space-y-2">
          <p className="text-gray-500 uppercase tracking-widest text-sm">Longest Streak</p>
          <p className="text-4xl font-bold">{formatTime(stats?.longestStreak || 0)}</p>
        </div>
      </div>

      <p className="text-2xl italic mb-16">“{randomSentence}”</p>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <button 
          onClick={() => navigate('/')}
          className="border-2 border-[#333] py-3 px-8 hover:bg-[#333] hover:text-white transition-colors text-lg"
        >
          Try Again
        </button>
        <button className="border-2 border-[#333] py-3 px-8 hover:bg-[#333] hover:text-white transition-colors text-lg">
          Share Session Link
        </button>
        <button 
          onClick={() => navigate('/')}
          className="border-2 border-[#333] py-3 px-8 hover:bg-[#333] hover:text-white transition-colors text-lg"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default Summary;
