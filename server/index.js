const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Multer setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ===== AWS Polly Config =====
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const polly = new AWS.Polly();

// ===== File Upload + Text Extraction =====
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const filePath = path.join(__dirname, file.path);
  const ext = path.extname(file.originalname).toLowerCase();

  try {
    let text = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (ext === '.txt') {
      text = fs.readFileSync(filePath, 'utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    fs.unlinkSync(filePath); // Cleanup
    res.json({ text, originalname: file.originalname });
  } catch (err) {
    console.error('Extraction error:', err);
    res.status(500).json({ error: 'Text extraction failed.' });
  }
});

// ===== Amazon Polly TTS + Direct MP3 Stream =====
app.post('/tts', async (req, res) => {
  const { text, fileName = 'tts-audio' } = req.body;

  const params = {
    OutputFormat: 'mp3',
    Text: text,
    VoiceId: 'Joanna', // Change to: Matthew, Ivy, Brian, etc.
    TextType: 'text',
  };

  try {
    const data = await polly.synthesizeSpeech(params).promise();

    if (!data.AudioStream) {
      return res.status(500).send('No audio stream returned by Polly.');
    }

    // Stream audio directly to client
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${fileName}.mp3"`,
    });

    res.send(data.AudioStream); // Send MP3 as binary stream
  } catch (err) {
    console.error('Polly error:', err);
    res.status(500).send('TTS failed.');
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
