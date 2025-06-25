import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUpload = ({ setExtractedText, setFileName }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:5000/upload', formData)
      .then(res => {
        setFileName(res.data.originalname);
        setExtractedText(res.data.text);
      })
      .catch(() => alert('Upload failed. Please try again.'));
  }, [setExtractedText, setFileName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-blue-500 p-10 rounded-xl text-center bg-gray-50 hover:bg-blue-50 cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the file here...</p> : <p>Drag & drop or click to upload</p>}
    </div>
  );
};

export default FileUpload;
