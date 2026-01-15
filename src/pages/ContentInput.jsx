import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const ContentInput = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const navigate = useNavigate();
  const { setContent } = useGame();

  // --- Handle URL parsing ---
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
      if (data.error) {
        alert(data.error);
      } else {
        setContent(data);
        navigate('/prep');
      }
    } catch (error) {
      console.error('URL parse error:', error);
      alert('Failed to parse article. Make sure the URL is correct and publicly accessible.');
    } finally {
      setLoading(false);
    }
  };

  // --- Handle PDF upload ---
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
      if (data.error) {
        alert(data.error);
      } else {
        setContent(data);
        navigate('/prep');
      }
    } catch (error) {
      console.error('PDF upload error:', error);
      alert('Failed to upload PDF. Make sure the file is valid.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-lg space-y-8 bg-white p-6 rounded-xl shadow-md">
        
        {/* URL Input */}
        <div className="space-y-2">
          <label className="block text-xl font-semibold">Paste a link</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            disabled={loading}
            className="w-full border-b-2 border-gray-400 py-2 focus:outline-none text-lg"
          />
        </div>

        <div className="text-center py-2 text-gray-500 font-medium">OR</div>

        {/* PDF Upload */}
        <div className="space-y-2">
          <label className="block text-xl font-semibold">Upload a PDF</label>
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
            className="block border-2 border-dashed border-gray-400 p-8 text-center cursor-pointer hover:bg-gray-100 rounded-md"
          >
            {uploadProgress || 'Click to upload PDF'}
          </label>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={loading || !url}
          className="w-full bg-gray-50 border-2 border-gray-400 py-3 px-6 hover:bg-gray-800 hover:text-white transition-colors text-lg font-medium rounded-md disabled:opacity-50"
        >
          {loading && !uploadProgress ? 'Parsing...' : 'Next'}
        </button>

      </div>
    </div>
  );
};

export default ContentInput;
