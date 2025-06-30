import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AudioControls from '../components/AudioControls';
import DownloadButton from '../components/DownloadButton';

const POLLY_VOICES = [
  { label: 'Joanna (US English)', value: 'Joanna' },
  { label: 'Matthew (US English)', value: 'Matthew' },
  { label: 'Ivy (US English)', value: 'Ivy' },
  { label: 'Brian (British English)', value: 'Brian' },
  { label: 'Amy (British English)', value: 'Amy' },
  { label: 'Raveena (Indian English)', value: 'Raveena' },
];

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { text, fileName, audioUrl, marksUrl, fileUrl } = location.state || {};
  const isPdf = fileName && fileName.toLowerCase().endsWith('.pdf');
  const [voice, setVoice] = useState('Joanna');

  if (!text || !fileName) {
    return (
      <div className="result-error">
        No file uploaded. Please go back and upload a file.
      </div>
    );
  }

  return (
    <div className="result-root">
      <div className="result-container">
        <h2 className="result-title">📄 {fileName}</h2>

        {/* Voice Selector */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="voice-select" style={{ fontWeight: 'bold', marginRight: 8 }}>
            Select Voice:
          </label>
          <select
            id="voice-select"
            value={voice}
            onChange={e => setVoice(e.target.value)}
            style={{ padding: '0.4rem', borderRadius: 4 }}
          >
            {POLLY_VOICES.map(v => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Controls */}
        <AudioControls text={text} voice={voice} audioUrl={audioUrl} marksUrl={marksUrl} />
        <DownloadButton text={text} fileName={fileName} voice={voice} />

        {/* File Preview */}
        {isPdf && fileUrl ? (
          <iframe
            src={fileUrl}
            title="PDF Preview"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}
          />
        ) : (
          <pre className="result-pre">{text}</pre>
        )}

        {/* Return Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#4a56e2',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🔙 Return to Upload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
