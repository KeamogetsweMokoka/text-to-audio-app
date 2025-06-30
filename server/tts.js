// server/tts.js
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const child_process = require('child_process');

// Configure AWS
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const polly = new AWS.Polly();
const MAX_CHARS = 3000;

function splitText(text, maxLength) {
  // Split on sentence boundaries if possible
  const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];
  const chunks = [];
  let chunk = '';
  for (const sentence of sentences) {
    if ((chunk + sentence).length > maxLength) {
      if (chunk) chunks.push(chunk);
      chunk = sentence;
    } else {
      chunk += sentence;
    }
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

async function synthesizeTTS(text, voice = 'Joanna') {
  const id = uuidv4();
  const audioPaths = [];
  const marks = [];
  const textChunks = splitText(text, MAX_CHARS);

  for (let i = 0; i < textChunks.length; i++) {
    const chunk = textChunks[i];
    const chunkId = `${id}_${i}`;
    const audioPath = path.join(__dirname, 'tts', `${chunkId}.mp3`);
    const marksPath = path.join(__dirname, 'tts', `${chunkId}.json`);

    // Audio synthesis
    const audioParams = {
      Text: chunk,
      OutputFormat: 'mp3',
      VoiceId: voice,
      Engine: 'neural',
    };
    // Speech mark synthesis
    const marksParams = {
      Text: chunk,
      OutputFormat: 'json',
      VoiceId: voice,
      SpeechMarkTypes: ['word'],
      Engine: 'neural',
    };

    // Polly synthesizeSpeech as promise
    const synthesize = (params) => new Promise((resolve, reject) => {
      polly.synthesizeSpeech(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Audio
    const audioData = await synthesize(audioParams);
    fs.writeFileSync(audioPath, audioData.AudioStream);
    audioPaths.push(audioPath);

    // Marks
    const markData = await synthesize(marksParams);
    const json = markData.AudioStream.toString('utf8').split('\n').filter(Boolean).map(JSON.parse);
    marks.push(...json);
    fs.writeFileSync(marksPath, JSON.stringify(json, null, 2));
  }

  // Concatenate audio files
  const finalAudioPath = path.join(__dirname, 'tts', `${id}.mp3`);
  if (audioPaths.length === 1) {
    fs.copyFileSync(audioPaths[0], finalAudioPath);
  } else {
    // Use ffmpeg to concatenate mp3s
    const listPath = path.join(__dirname, 'tts', `${id}_list.txt`);
    fs.writeFileSync(listPath, audioPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
    child_process.execSync(`ffmpeg -y -f concat -safe 0 -i "${listPath}" -c copy "${finalAudioPath}"`);
    fs.unlinkSync(listPath);
    // Optionally, clean up chunk files
    audioPaths.forEach(p => fs.unlinkSync(p));
  }

  // Merge marks as NDJSON (one JSON object per line)
  const finalMarksPath = path.join(__dirname, 'tts', `${id}.json`);
  fs.writeFileSync(finalMarksPath, marks.map(m => JSON.stringify(m)).join('\n'));
  // Optionally, clean up chunk mark files
  for (let i = 0; i < textChunks.length; i++) {
    const marksPath = path.join(__dirname, 'tts', `${id}_${i}.json`);
    if (fs.existsSync(marksPath)) fs.unlinkSync(marksPath);
  }

  return { audioPath: finalAudioPath, marksPath: finalMarksPath };
}

module.exports = { synthesizeTTS };
