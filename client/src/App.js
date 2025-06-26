import React, { useState } from 'react';
import UploadPage from './components/UploadPage';
import ResultPage from './components/ResultPage';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [view, setView] = useState('upload'); // 'upload' or 'result'

  const handleUploadComplete = (text, name) => {
    setExtractedText(text);
    setFileName(name);
    setView('result');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'upload' ? (
        <UploadPage onUploadComplete={handleUploadComplete} />
      ) : (
        <ResultPage
          text={extractedText}
          fileName={fileName}
          goBack={() => setView('upload')}
        />
      )}
    </div>
  );
}

export default App;
