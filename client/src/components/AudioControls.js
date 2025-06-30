// client/src/components/AudioControls.js
import React, { useEffect, useRef, useState } from 'react';

const AudioControls = ({ text, audioUrl, marksUrl }) => {
  const audioRef = useRef(null);
  const [marks, setMarks] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(null);

  useEffect(() => {
    if (!audioUrl || !marksUrl) return;

    // Fetch speech marks
    const fetchMarks = async () => {
      const marksRes = await fetch(`http://localhost:5000${marksUrl}`);
      const markData = await marksRes.json();
      setMarks(markData);
      audioRef.current.src = `http://localhost:5000${audioUrl}`;
    };

    fetchMarks();
  }, [audioUrl, marksUrl]);

  useEffect(() => {
    if (!audioRef.current || marks.length === 0) return;

    const audioElem = audioRef.current;
    const onTimeUpdate = () => {
      const currentTime = audioElem.currentTime * 1000; // convert to ms
      const currentMark = marks.find((m, i) => {
        const next = marks[i + 1];
        return currentTime >= m.time && (!next || currentTime < next.time);
      });
      if (currentMark) {
        setHighlightIndex(currentMark.start);
      }
    };

    audioElem.addEventListener('timeupdate', onTimeUpdate);
    return () => audioElem.removeEventListener('timeupdate', onTimeUpdate);
  }, [marks]);

  // Reconstruct text with highlighting
  const words = text.split(/\s+/);
  const highlighted = words.map((word, idx) => (
    <span
      key={idx}
      style={{
        backgroundColor: idx === highlightIndex ? 'yellow' : 'transparent',
        transition: 'background-color 0.2s',
      }}
    >
      {word + ' '}
    </span>
  ));

  return (
    <div>
      <audio controls ref={audioRef} />
      <div style={{ marginTop: '1rem', lineHeight: '1.6', fontSize: '1rem', color: '#000' }}>
        {highlighted}
      </div>
    </div>
  );
};

export default AudioControls;
