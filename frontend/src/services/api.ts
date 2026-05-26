import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface ChatRequest {
  query: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  sources: string[];
  conversation_id: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  sources?: string[];
}

export interface ConversationData {
  conversation_id: string;
  messages: Message[];
}

export const apiClient = {
  async sendChat(request: ChatRequest): Promise<ChatResponse> {
    const response = await axios.post(`${API_BASE_URL}/chat/query`, request);
    return response.data;
  },

  async getConversation(conversationId: string): Promise<ConversationData> {
    const response = await axios.get(`${API_BASE_URL}/chat/conversation/${conversationId}`);
    return response.data;
  },

  async uploadDocument(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getStats(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/documents/stats`);
    return response.data;
  },

  async healthCheck(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }
};
