import React from 'react';
import { useLocation } from 'react-router-dom';
import AudioControls from '../components/AudioControls';
import DownloadButton from '../components/DownloadButton';

const ResultPage = () => {
  const location = useLocation();
  const { text, fileName, fileUrl } = location.state || {};
  const isPdf = fileName && fileName.toLowerCase().endsWith('.pdf');

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
        {isPdf && fileUrl ? (
          <iframe
            src={fileUrl}
            title="PDF Preview"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}
          />
        ) : (
          <pre className="result-pre">
            {text}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
