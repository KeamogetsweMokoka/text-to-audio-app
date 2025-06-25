import React from 'react';
import axios from 'axios';

const DownloadButton = ({ text, fileName }) => {
  const downloadPollyAudio = async () => {
  try {
    const res = await axios.post(
      'http://localhost:5000/tts',
      { text, fileName: fileName.replace(/\.[^/.]+$/, '') },
      { responseType: 'arraybuffer' } // Important
    );

    const blob = new Blob([res.data], { type: 'audio/mpeg' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Polly download failed:', err);
    alert('Audio download failed.');
  }
};


  return (
    <button onClick={downloadPollyAudio} className="bg-indigo-600 text-white px-4 py-2 rounded">
      ⬇️ Download Audio (Amazon Polly)
    </button>
  );
};

export default DownloadButton;
