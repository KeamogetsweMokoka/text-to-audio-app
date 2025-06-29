import React from 'react';
import { useLocation } from 'react-router-dom';
import AudioControls from '../components/AudioControls';
import DownloadButton from '../components/DownloadButton';

const ResultPage = () => {
  const location = useLocation();
  const { text, fileName } = location.state || {};

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
        <AudioControls text={text} />
        <DownloadButton text={text} fileName={fileName} />
        <pre className="result-pre">
          {text}
        </pre>
      </div>
    </div>
  );
};

export default ResultPage;
