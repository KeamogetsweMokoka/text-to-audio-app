const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { synthesizeTTS } = require('./tts'); // ⬅ Import Polly logic
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve static audio/speech mark files
app.use('/tts', express.static(path.join(__dirname, 'tts')));

// Setup uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
});

// === ROUTES ===

// Upload file + extract text
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Received upload request');
  const file = req.file;
  const filePath = path.join(__dirname, file.path);
  const ext = path.extname(file.originalname).toLowerCase();
  console.log('File path:', filePath, 'Extension:', ext);

  try {
    let text = '';
    if (ext === '.pdf') {
      console.log('Extracting text from PDF...');
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
      console.log('PDF text extracted');
    } else if (ext === '.docx') {
      console.log('Extracting text from DOCX...');
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
      console.log('DOCX text extracted');
    } else if (ext === '.txt') {
      console.log('Extracting text from TXT...');
      text = fs.readFileSync(filePath, 'utf-8');
      console.log('TXT text extracted');
    } else {
      console.log('Unsupported file type');
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    // Generate audio and marks right after extraction
    try {
      console.log('Calling synthesizeTTS...');
      const { audioPath, marksPath } = await synthesizeTTS(text, 'Joanna');
      console.log('synthesizeTTS finished:', audioPath, marksPath);
      fs.unlinkSync(filePath); // Clean up after extraction
      res.json({
        text,
        originalname: file.originalname,
        audioUrl: `/tts/${path.basename(audioPath)}`,
        marksUrl: `/tts/${path.basename(marksPath)}`,
      });
    } catch (ttsErr) {
      console.error('TTS generation error:', ttsErr);
      res.status(500).json({ error: 'TTS generation failed.', details: ttsErr.message });
    }
  } catch (err) {
    console.error('Extraction error:', err);
    res.status(500).json({ error: 'Text extraction or TTS failed.' });
  }
});

// TTS + speech mark route
app.post('/tts', async (req, res) => {
  const { text, fileName = 'tts-audio', voice = 'Joanna' } = req.body;

  try {
    const { audioPath, marksPath } = await synthesizeTTS(text, voice);

    res.json({
      audioUrl: `/tts/${path.basename(audioPath)}`,
      marksUrl: `/tts/${path.basename(marksPath)}`,
    });
  } catch (err) {
    console.error('Polly error:', err);
    res.status(500).send('TTS failed.');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
