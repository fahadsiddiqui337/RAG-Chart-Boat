import { useState, useRef, useEffect } from 'react';
import { apiClient, ChatResponse, Message } from '../services/api';
import '../styles/ChatBox.css';

interface ChatBoxProps {
  conversationId: string | null;
  onConversationChange: (id: string) => void;
}

interface CopyFeedback {
  id: number;
  visible: boolean;
}

export const ChatBox = ({ conversationId, onConversationChange }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId);
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>({ id: -1, visible: false });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  const loadConversation = async (id: string) => {
    try {
      const data = await apiClient.getConversation(id);
      setMessages(data.messages);
      setCurrentConversationId(id);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback({ id: index, visible: true });
      setTimeout(() => setCopyFeedback({ id: index, visible: false }), 2000);
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    const userMessage: Message = {
      role: 'user',
      content: userQuery,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response: ChatResponse = await apiClient.sendChat({
        query: userQuery,
        conversation_id: currentConversationId || undefined,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        sources: response.sources,
      };
      setMessages(prev => [...prev, assistantMessage]);

      setCurrentConversationId(response.conversation_id || '');
      onConversationChange(response.conversation_id || '');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      if (!loading && input.trim()) {
        handleSendMessage(e as any);
      }
    }
  };

  return (
    <div className="chatbox-container">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>Welcome to RAG Chat Board</h2>
            <p>Upload documents and start chatting! Your queries will be answered based on the uploaded content.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message message-${message.role}`}>
              <div className="message-content">
                <p>{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="sources">
                    <strong>📎 Sources:</strong> {message.sources.join(', ')}
                  </div>
                )}
                <div className="message-footer">
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                  {message.role === 'assistant' && (
                    <button
                      type="button"
                      className="copy-button"
                      onClick={() => copyToClipboard(message.content, index)}
                      title="Copy to clipboard"
                    >
                      {copyFeedback.id === index && copyFeedback.visible ? '✓ Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="message message-assistant">
            <div className="message-content">
              <p className="loading">⏳ Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="input-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question... (Shift+Enter for new line)"
          disabled={loading}
          className="input-field"
          rows={1}
        />
        <button type="submit" disabled={loading || !input.trim()} className="send-button">
          {loading ? '⏳ Sending...' : '📤 Send'}
        </button>
      </form>
    </div>
  );
};
