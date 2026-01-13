import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const PrepScreen = () => {
  const navigate = useNavigate();
  const { content } = useGame();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!content) {
      navigate('/');
      return;
    }
  }, [content, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">{content?.title}</h2>
      <p className="text-xl text-gray-600 mb-8">Estimated length: {content?.estimatedTime}</p>
      
      <div className="mb-12">
        <p className="text-2xl italic">“When you leave, time stops.”</p>
      </div>

      <button 
        onClick={() => navigate('/read')}
        className="border-2 border-[#333] py-3 px-12 hover:bg-[#333] hover:text-white transition-colors text-xl"
      >
        Begin
      </button>
    </div>
  );
};

export default PrepScreen;
