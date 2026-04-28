import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
<<<<<<< HEAD

const ContentInput = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setContent } = useGame();

  const handleNext = async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setContent(data);
        navigate('/prep');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to parse article');
=======
import { motion } from 'framer-motion';

const ContentInput = () => {
  const [url, setUrl] = useState('');
  const [joinId, setJoinId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const navigate = useNavigate();
  const { setContent, mode, setSessionId } = useGame();

  const createSession = async (contentData) => {
    if (mode === 'together' || mode === 'duel') {
      try {
        const res = await fetch('http://localhost:4000/api/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: contentData, mode }),
        });
        const sessionData = await res.json();
        setSessionId(sessionData.sessionId);
      } catch (err) {
        console.error('Session creation error:', err);
      }
    }
  };

  const handleJoin = async () => {
    if (!joinId) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/session/${joinId}`);
      const data = await response.json();
      if (data.error) alert(data.error);
      else {
        setContent(data.content);
        setSessionId(joinId);
        navigate('/prep');
      }
    } catch (error) {
      console.error('Session join error:', error);
      alert('Failed to join session.');
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-4">
          <label className="block text-xl">Paste a link</label>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            disabled={loading}
            className="w-full bg-transparent border-b-2 border-[#333] py-2 focus:outline-none text-lg"
          />
        </div>
        
        <div className="text-center py-4 text-gray-500">OR</div>

        <div className="space-y-4">
          <label className="block text-xl">Upload a PDF</label>
          <input 
            type="file" 
            accept="application/pdf"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              
              setLoading(true);
              const formData = new FormData();
              formData.append('pdf', file);
              
              try {
                const response = await fetch('http://localhost:3001/api/upload-pdf', {
                  method: 'POST',
                  body: formData,
                });
                const data = await response.json();
                if (data.error) alert(data.error);
                else {
                  setContent(data);
                  navigate('/prep');
                }
              } catch (error) {
                console.error(error);
                alert('Failed to upload PDF');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="hidden"
            id="pdf-upload"
          />
          <label 
            htmlFor="pdf-upload"
            className="block border-2 border-dashed border-[#333] p-8 text-center cursor-pointer hover:bg-gray-100"
          >
            {loading ? 'Uploading...' : 'Click to upload'}
          </label>
        </div>

        <button 
          onClick={handleNext}
          disabled={loading || !url}
          className="w-full border-2 border-[#333] py-3 px-6 hover:bg-[#333] hover:text-white transition-colors text-lg mt-8 disabled:opacity-50"
        >
          {loading ? 'Parsing...' : 'Next'}
        </button>
      </div>
=======
  const handleNext = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.error) alert(data.error);
      else {
        setContent(data);
        await createSession(data);
        navigate('/prep');
      }
    } catch (error) {
      console.error('URL parse error:', error);
      alert('Failed to parse article.');
    } finally {
      setLoading(false);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setUploadProgress('Uploading...');
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const response = await fetch('http://localhost:4000/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.error) alert(data.error);
      else {
        setContent(data);
        await createSession(data);
        navigate('/prep');
      }
    } catch (error) {
      console.error('PDF upload error:', error);
      alert('Failed to upload PDF.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#fafafa]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl space-y-12 bg-white p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] rounded-2xl"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">
            {mode === 'alone' ? 'What are we reading?' : 'Start or Join a Session'}
          </h2>
          <p className="text-gray-500">
            {mode === 'alone' 
              ? 'Paste a link or upload a PDF to begin your focus session.' 
              : 'Create a new session or enter a code to join your friend.'}
          </p>
        </div>
        
        <div className="space-y-8">
          {(mode === 'together' || mode === 'duel') && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-widest text-black">Join Existing Session</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    placeholder="Enter Session Code"
                    className="flex-1 bg-gray-50 border-2 border-gray-100 py-3 px-4 focus:border-black transition-all outline-none font-mono"
                  />
                  <button
                    onClick={handleJoin}
                    disabled={loading || !joinId}
                    className="bg-black text-white px-6 font-bold disabled:opacity-20"
                  >
                    Join
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-bold tracking-widest">or create new</span></div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Article Link</label>
            <div className="relative group">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://medium.com/..."
                disabled={loading}
                className="w-full bg-gray-50 border-2 border-transparent border-b-gray-200 py-4 px-0 focus:border-b-black focus:bg-white transition-all outline-none text-xl font-medium"
              />
              <div className="absolute bottom-0 left-0 h-0.5 bg-black w-0 group-focus-within:w-full transition-all duration-300" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-bold tracking-widest">or</span></div>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase font-bold tracking-widest text-gray-400">PDF Document</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              disabled={loading}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-10 cursor-pointer hover:border-black hover:bg-gray-50 transition-all rounded-xl group"
            >
              <svg className="w-8 h-8 mb-3 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <span className="font-bold text-gray-500 group-hover:text-black transition-colors">
                {uploadProgress || 'Drop your PDF here'}
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={loading || !url}
          className="w-full bg-black text-white py-5 px-6 hover:bg-gray-800 transition-all text-lg font-black tracking-tight rounded-xl disabled:opacity-20 active:scale-[0.98]"
        >
          {loading && !uploadProgress ? 'STAREing...' : 'Start New Session'}
        </button>
      </motion.div>
>>>>>>> c874277dda995d89f0c6e26da788059868a51d69
    </div>
  );
};

export default ContentInput;
