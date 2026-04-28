import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69

const Landing = () => {
  const navigate = useNavigate();
  const { setMode } = useGame();

  const handleChoice = (mode) => {
    setMode(mode);
    navigate('/input');
  };

<<<<<<< HEAD
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
=======
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#fafafa]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-6xl mb-4 font-black tracking-tighter text-gray-900"
        >
          STARE
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-xl mb-12 text-gray-500 font-medium"
        >
          How long can you focus?
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col space-y-4 w-full max-w-sm mx-auto"
        >
          <button 
            onClick={() => handleChoice('alone')}
            className="group relative border-2 border-black py-4 px-8 overflow-hidden font-bold text-lg transition-all"
          >
            <div className="absolute inset-0 w-0 bg-black transition-all duration-[250ms] ease-out group-hover:w-full" />
            <span className="relative group-hover:text-white transition-colors duration-[250ms]">Read Alone</span>
          </button>
          
          <button 
            onClick={() => handleChoice('together')}
            className="group relative border-2 border-black py-4 px-8 overflow-hidden font-bold text-lg transition-all"
          >
            <div className="absolute inset-0 w-0 bg-black transition-all duration-[250ms] ease-out group-hover:w-full" />
            <span className="relative group-hover:text-white transition-colors duration-[250ms]">Read Together</span>
          </button>
          
          <button 
            onClick={() => handleChoice('duel')}
            className="group relative border-2 border-black py-4 px-8 overflow-hidden font-bold text-lg transition-all"
          >
            <div className="absolute inset-0 w-0 bg-black transition-all duration-[250ms] ease-out group-hover:w-full" />
            <span className="relative group-hover:text-white transition-colors duration-[250ms]">Quiet Duel</span>
          </button>
        </motion.div>
      </motion.div>
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69
    </div>
  );
};

export default Landing;
