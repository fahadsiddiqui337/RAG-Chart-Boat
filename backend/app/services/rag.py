from .embeddings import EmbeddingService
from .llm import LLMService
from typing import List, Dict, Tuple
import uuid
from datetime import datetime

class RAGService:
    def __init__(self):
        """Initialize RAG service"""
        self.embeddings_service = EmbeddingService()
        self.llm_service = LLMService()
        self.conversations: Dict[str, List[Dict]] = {}
    
    def process_query(self, query: str, conversation_id: str = None) -> Dict:
        """Process a user query with RAG"""
        # Generate or use existing conversation ID
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
            self.conversations[conversation_id] = []
        
        # Retrieve relevant documents
        relevant_chunks = self.embeddings_service.retrieve_relevant_chunks(query, n_results=5)
        
        # Generate response with context
        response = self.llm_service.generate_response(query, relevant_chunks)
        
        # Extract sources
        sources = list(set([source for _, source, _ in relevant_chunks]))
        
        # Store in conversation history
        self.conversations[conversation_id].append({
            "role": "user",
            "content": query,
            "timestamp": datetime.now().isoformat()
        })
        self.conversations[conversation_id].append({
            "role": "assistant",
            "content": response,
            "timestamp": datetime.now().isoformat(),
            "sources": sources
        })
        
        return {
            "response": response,
            "sources": sources,
            "conversation_id": conversation_id
        }
    
    def get_conversation(self, conversation_id: str) -> List[Dict]:
        """Get conversation history"""
        return self.conversations.get(conversation_id, [])
    
    def add_document(self, filename: str, content: str) -> Dict:
        """Add document to RAG system"""
        doc_id = str(uuid.uuid4())
        chunks_count = self.embeddings_service.add_document(
            doc_id=doc_id,
            text=content,
            filename=filename
        )
        return {
            "doc_id": doc_id,
            "filename": filename,
            "chunks_created": chunks_count
        }
    
    def get_stats(self) -> Dict:
        """Get RAG system statistics"""
        collection_stats = self.embeddings_service.get_collection_stats()
        available_models = self.llm_service.list_available_models()
        
        return {
            **collection_stats,
            "conversations_count": len(self.conversations),
            "available_models": available_models,
            "current_model": self.llm_service.model
        }
