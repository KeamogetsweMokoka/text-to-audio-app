import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AudioControls from './components/AudioControls';
import DownloadButton from './components/DownloadButton';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [fileName, setFileName] = useState('');

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-900 space-y-6">
      <FileUpload setExtractedText={setExtractedText} setFileName={setFileName} />

      {extractedText && (
        <div className="bg-gray-100 p-4 rounded shadow space-y-4">
          <h2 className="font-bold text-lg">📄 {fileName}</h2>
          <AudioControls text={extractedText} />
          <DownloadButton text={extractedText} fileName={fileName} />
          <pre className="whitespace-pre-wrap text-sm max-h-[300px] overflow-auto bg-white p-2 rounded">
            {extractedText.substring(0, 2000)}
            {extractedText.length > 2000 && '...'}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
