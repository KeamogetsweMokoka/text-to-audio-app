import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function UploadPage({ onUploadComplete }) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      onUploadComplete(res.data.text, res.data.originalname);
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setIsLoading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-900 to-indigo-950 text-white px-4 pb-20">
      
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-2">
          🔊 <span className="text-white">FileSpeak</span>
        </h1>
        <p className="text-sm mt-1 text-indigo-300">🎧 Drag. Listen. Love it.</p>
      </header>

      {/* Hero */}
      <section className="text-center max-w-2xl mb-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-pink-400 to-blue-400 text-transparent bg-clip-text">
            Let Your Files Speak to You
          </span>
        </h2>
        <p className="text-lg text-indigo-200">
          Transform any document into immersive audio in seconds. Drop a file and we’ll give it a voice you’ll love to listen to.
        </p>
      </section>

      {/* Upload Box */}
      <section className="w-full max-w-xl mb-14">
        <div
          {...getRootProps()}
          className={`bg-white/5 border-4 border-dashed rounded-xl text-center p-10 transition cursor-pointer backdrop-blur-md ${
            isDragActive ? 'border-blue-400 bg-white/10' : 'hover:border-indigo-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-5xl mb-3">⬆️</div>
          <p className="text-xl font-semibold">Drop your file here</p>
          <p className="text-sm text-indigo-300 mt-1">or click to browse your files</p>
          <div className="mt-2 text-sm text-indigo-400 space-x-2">
            <span>📄 TXT</span>
            <span>📘 PDF</span>
            <span>📑 DOCX</span>
          </div>
        </div>

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400 animate-pulse w-full" />
            </div>
            <p className="text-sm text-indigo-300 mt-1">Extracting text...</p>
          </div>
        )}
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-6xl w-full px-2">
        <div className="bg-white/10 rounded-xl p-6 shadow-lg hover:shadow-indigo-400/30 transition">
          <p className="text-3xl mb-2">⚡</p>
          <h3 className="font-bold text-lg mb-1">Lightning Fast</h3>
          <p className="text-sm text-indigo-200">
            Convert any document to audio in seconds with our advanced AI processing.
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-6 shadow-lg hover:shadow-indigo-400/30 transition">
          <p className="text-3xl mb-2">💜</p>
          <h3 className="font-bold text-lg mb-1">Premium Voices</h3>
          <p className="text-sm text-indigo-200">
            Choose from high-quality, natural-sounding voices powered by Amazon Polly or ElevenLabs.
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-6 shadow-lg hover:shadow-indigo-400/30 transition">
          <p className="text-3xl mb-2">🎧</p>
          <h3 className="font-bold text-lg mb-1">Perfect for Multitasking</h3>
          <p className="text-sm text-indigo-200">
            Listen to your documents while commuting, exercising, or doing other tasks.
          </p>
        </div>
      </section>
    </div>
  );
}

export default UploadPage;
