import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import '../styles.css';

function UploadPage({ onUploadComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
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
    },
  });

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>🔊 FileSpeak</h1>
        <p>🎧 Drag. Listen. Love it.</p>
      </header>

      {/* Hero */}
      <section className="hero">
        <h2>Let Your Files Speak to You</h2>
        <p>
          Transform any document into immersive audio in seconds. Drop a file and
          we’ll give it a voice you’ll love to listen to.
        </p>
      </section>

      {/* Upload Box */}
      <section className="upload-box-wrapper">
        <div
          {...getRootProps()}
          className={`upload-box ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: '2.5rem' }}>⬆️</div>
          <p>Drop your file here</p>
          <p className="file-types">📄 TXT &nbsp; 📘 PDF &nbsp; 📑 DOCX</p>
        </div>

        {isLoading && (
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
            <p className="file-types">Extracting text...</p>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <p style={{ fontSize: '1.5rem' }}>⚡</p>
          <h3>Lightning Fast</h3>
          <p>Convert any document to audio in seconds with our advanced AI.</p>
        </div>

        <div className="feature-card">
          <p style={{ fontSize: '1.5rem' }}>💜</p>
          <h3>Premium Voices</h3>
          <p>Powered by Amazon Polly to deliver human-like clarity and tone.</p>
        </div>

        <div className="feature-card">
          <p style={{ fontSize: '1.5rem' }}>🎧</p>
          <h3>Multitask Friendly</h3>
          <p>Listen to your documents while commuting, working out or relaxing.</p>
        </div>
      </section>
    </div>
  );
}

export default UploadPage;
