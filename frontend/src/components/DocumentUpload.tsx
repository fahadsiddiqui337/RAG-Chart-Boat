import React, { useState, useRef } from 'react';
import { apiClient } from '../services/api';
import '../styles/DocumentUpload.css';

interface DocumentUploadProps {
  onUploadSuccess: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.txt')) {
        setFile(droppedFile);
        setMessage('');
      } else {
        setMessage('Please drop a PDF or TXT file');
        setMessageType('error');
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const response = await apiClient.uploadDocument(file);
      setMessage(`✓ ${response.message}`);
      setMessageType('success');
      setFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onUploadSuccess();
    } catch (error) {
      setMessage('Error uploading file. Please try again.');
      setMessageType('error');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className={`upload-container ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h3>📄 Upload Documents</h3>
      <form onSubmit={handleUpload} className="upload-form">
        <label className="file-label">
          <span className="file-input-text">
            {file ? file.name : 'Choose file or drag here (PDF or TXT)'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.txt"
            disabled={uploading}
            className="file-input"
          />
        </label>
        <button
          type="submit"
          disabled={!file || uploading}
          className="upload-button"
        >
          {uploading ? '⏳ Uploading...' : '📤 Upload'}
        </button>
      </form>
      {message && (
        <div className={`message-alert ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};
