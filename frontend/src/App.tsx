import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatBox } from './components/ChatBox';
import { DocumentUpload } from './components/DocumentUpload';
import './App.css';

function App() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewConversation = () => {
    setConversationId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleConversationChange = (id: string) => {
    setConversationId(id);
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <Sidebar key={refreshTrigger} onNewConversation={handleNewConversation} />
      <div className="main-content">
        <div className="content-top">
          <DocumentUpload onUploadSuccess={handleUploadSuccess} />
        </div>
        <div className="content-bottom">
          <ChatBox
            conversationId={conversationId}
            onConversationChange={handleConversationChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
