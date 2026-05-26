import chromadb
from typing import List, Tuple
import os
from datetime import datetime

class EmbeddingService:
    def __init__(self):
        """Initialize Chroma client for vector storage"""
        persist_dir = os.path.join(os.path.dirname(__file__), "../../data/chroma")
        os.makedirs(persist_dir, exist_ok=True)
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.collection = self.client.get_or_create_collection(
            name="rag_documents",
            metadata={"hnsw:space": "cosine"}
        )

    def add_document(self, doc_id: str, text: str, filename: str, metadata: dict = None):
        """Add document chunks to vector store"""
        # Split text into chunks
        chunks = self._chunk_text(text)
        
        # Create unique IDs for each chunk
        chunk_ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        
        # Add metadata
        metadatas = []
        for i in range(len(chunks)):
            meta = {
                "source": filename,
                "chunk_index": str(i),
                "doc_id": doc_id,
                "uploaded_at": datetime.now().isoformat()
            }
            if metadata:
                meta.update(metadata)
            metadatas.append(meta)
        
        # Add to collection
        self.collection.add(
            ids=chunk_ids,
            documents=chunks,
            metadatas=metadatas
        )
        
        return len(chunks)

    def retrieve_relevant_chunks(self, query: str, n_results: int = 5) -> List[Tuple[str, str, dict]]:
        """Retrieve relevant document chunks for a query"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            
            if not results or not results['documents'] or len(results['documents'][0]) == 0:
                return []
            
            retrieved = []
            for i, doc in enumerate(results['documents'][0]):
                metadata = results['metadatas'][0][i] if results['metadatas'] else {}
                distance = results['distances'][0][i] if results['distances'] else 0
                retrieved.append((doc, metadata.get('source', 'Unknown'), metadata))
            
            return retrieved
        except Exception as e:
            print(f"Error retrieving chunks: {e}")
            return []

    def _chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 100) -> List[str]:
        """Split text into overlapping chunks"""
        chunks = []
        for i in range(0, len(text), chunk_size - overlap):
            chunk = text[i:i + chunk_size]
            if len(chunk.strip()) > 0:
                chunks.append(chunk)
        return chunks if chunks else [text]

    def get_collection_stats(self) -> dict:
        """Get statistics about the collection"""
        try:
            count = self.collection.count()
            return {
                "total_chunks": count,
                "collection_name": "rag_documents"
            }
        except Exception as e:
            return {"error": str(e)}

    def clear_collection(self):
        """Clear all documents from collection"""
        self.client.delete_collection(name="rag_documents")
        self.collection = self.client.get_or_create_collection(
            name="rag_documents",
            metadata={"hnsw:space": "cosine"}
        )
