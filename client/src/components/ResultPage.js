import React from 'react';
import AudioControls from './AudioControls';
import DownloadButton from './DownloadButton';

function ResultPage({ text, fileName, goBack }) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📄 {fileName}</h2>
        <button onClick={goBack} className="text-blue-600 hover:underline text-sm">⬅️ Upload another file</button>
      </div>

      <AudioControls text={text} />
      <DownloadButton text={text} fileName={fileName} />

      <div className="bg-white p-6 rounded shadow border border-gray-200 text-sm whitespace-pre-wrap overflow-y-auto max-h-[80vh]">
        {text}
      </div>
    </div>
  );
}

export default ResultPage;
