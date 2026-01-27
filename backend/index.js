// backend/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const multer = require('multer');
const pdf = require('pdf-parse'); // Fix pdf-parse import
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175"
];

// Configure CORS
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("CORS policy does not allow this origin"), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST"]
}));

app.use(express.json());

// Create HTTP server & Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Multer setup for PDF uploads
const upload = multer({ storage: multer.memoryStorage() });

// In-memory session store
const sessions = new Map();

// --- Routes ---

// Create a new session
app.post('/api/create-session', (req, res) => {
  const sessionId = Math.random().toString(36).substring(7);
  const { content, mode } = req.body;
  sessions.set(sessionId, { content, mode, users: [] });
  res.json({ sessionId });
});

// Get session data
app.get('/api/session/:id', (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// Parse article from URL
app.post('/api/parse', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    if (typeof response.data !== 'string') {
      return res.status(400).json({ error: 'URL did not return a valid article (not a text response)' });
    }

    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) return res.status(400).json({ error: 'Failed to parse article content. Try another link.' });

    const wordCount = article.textContent.split(/\s+/).length;
    const estimatedTime = Math.ceil(wordCount / 200) + ' min';

    res.json({
      title: article.title,
      text: article.textContent,
      html: article.content, 
      estimatedTime
    });
  } catch (error) {
    console.error('Parse Error:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ error: `Failed to fetch URL: ${error.response.statusText}` });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(504).json({ error: 'No response received from the URL server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: error.message });
    }
  }
});


app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const data = await pdf(req.file.buffer); 
    
    if (!data || !data.text) {
      return res.status(400).json({ error: 'Failed to extract text from PDF' });
    }

    const wordCount = data.text.split(/\s+/).length;
    const estimatedTime = Math.ceil(wordCount / 200) + ' min';

    res.json({
      title: req.file.originalname,
      text: data.text,
      html: null, 
      estimatedTime
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
});

// --- Socket.IO events ---
io.on('connection', (socket) => {
  socket.on('join-session', ({ sessionId, userId }) => {
    socket.join(sessionId);
    const session = sessions.get(sessionId);
    if (session) {
      session.users.push({ userId, status: 'here' });
      io.to(sessionId).emit('user-joined', { userId });
    }
  });

  socket.on('status-change', ({ sessionId, userId, status }) => {
    const session = sessions.get(sessionId);
    if (session) {
      const user = session.users.find(u => u.userId === userId);
      if (user) user.status = status;
      io.to(sessionId).emit('status-updated', { userId, status });
    }
  });

  socket.on('finish-session', ({ sessionId, userId, stats }) => {
    io.to(sessionId).emit('user-finished', { userId, stats });
  });
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
