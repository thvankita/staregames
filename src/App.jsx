import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Landing from './pages/Landing';
import ContentInput from './pages/ContentInput';
import PrepScreen from './pages/PrepScreen';
import Reader from './pages/Reader';
import Summary from './pages/Summary';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-[#f5f1ed] text-[#333] font-serif">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/input" element={<ContentInput />} />
            <Route path="/prep" element={<PrepScreen />} />
            <Route path="/read" element={<Reader />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
