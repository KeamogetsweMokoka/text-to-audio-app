import React, { useState } from 'react';

const AudioControls = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="flex gap-2">
      {!isSpeaking && (
        <button onClick={speakText} className="bg-green-500 text-white px-4 py-2 rounded">▶️ Play</button>
      )}
      <button onClick={() => speechSynthesis.pause()} className="bg-yellow-500 text-white px-4 py-2 rounded">⏸️ Pause</button>
      <button onClick={() => speechSynthesis.resume()} className="bg-blue-500 text-white px-4 py-2 rounded">🔁 Resume</button>
      <button onClick={() => { speechSynthesis.cancel(); setIsSpeaking(false); }} className="bg-red-500 text-white px-4 py-2 rounded">⏹️ Stop</button>
    </div>
  );
};

export default AudioControls;
