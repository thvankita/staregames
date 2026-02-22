import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Landing = () => {
  const navigate = useNavigate();
  const { setMode } = useGame();

  const handleChoice = (mode) => {
    setMode(mode);
    navigate('/input');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl mb-12 font-bold tracking-tight">How long can you read without leaving?</h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button 
          onClick={() => handleChoice('alone')}
          className="border-2 border-[#333] py-3 px-6 hover:bg-[#333] hover:text-white transition-colors text-lg"
        >
          Read Alone
        </button>
        <button 
          onClick={() => handleChoice('together')}
          className="border-2 border-[#333] py-3 px-6 hover:bg-[#333] hover:text-white transition-colors text-lg"
        >
          Read Together
        </button>
        <button 
          onClick={() => handleChoice('duel')}
          className="border-2 border-[#333] py-3 px-6 hover:bg-[#333] hover:text-white transition-colors text-lg"
        >
          Quiet Duel
        </button>
      </div>
    </div>
  );
};

export default Landing;
