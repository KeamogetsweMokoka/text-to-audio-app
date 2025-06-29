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
    <div className="audio-controls">
      {!isSpeaking && (
        <button onClick={speakText} className="audio-btn play">▶️ Play</button>
      )}
      <button onClick={() => speechSynthesis.pause()} className="audio-btn pause">⏸️ Pause</button>
      <button onClick={() => speechSynthesis.resume()} className="audio-btn resume">🔁 Resume</button>
      <button onClick={() => { speechSynthesis.cancel(); setIsSpeaking(false); }} className="audio-btn stop">⏹️ Stop</button>
    </div>
  );
};

export default AudioControls;
