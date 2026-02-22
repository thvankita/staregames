import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

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
    } finally {
      setLoading(false);
    }
  };

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
    </div>
  );
};

export default ContentInput;
