import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import '../styles/Sidebar.css';

interface Stats {
  total_chunks?: number;
  conversations_count?: number;
  available_models?: string[];
  current_model?: string;
}

interface SidebarProps {
  onNewConversation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewConversation }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
    // Refresh stats every 10 seconds
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>RAG Chat Board</h1>
      </div>

      <button className="new-chat-button" onClick={onNewConversation}>
        + New Chat
      </button>

      <div className="sidebar-section">
        <h3>Statistics</h3>
        <div className="stats-container">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : stats ? (
            <>
              <div className="stat-item">
                <span className="stat-label">Documents Chunks:</span>
                <span className="stat-value">{stats.total_chunks || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Conversations:</span>
                <span className="stat-value">{stats.conversations_count || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Current Model:</span>
                <span className="stat-value">{stats.current_model || 'N/A'}</span>
              </div>
            </>
          ) : (
            <p className="error">Unable to load statistics</p>
          )}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Available Models</h3>
        <div className="models-list">
          {stats?.available_models && stats.available_models.length > 0 ? (
            stats.available_models.map((model, index) => (
              <div key={index} className="model-item">
                {model}
              </div>
            ))
          ) : (
            <p className="info">No models available. Make sure Ollama is running.</p>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <p className="version">RAG Chat v1.0</p>
      </div>
    </div>
  );
};
