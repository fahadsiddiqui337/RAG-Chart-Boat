# RAG Chat Board - Environment Setup

## Environment Variables (Optional)

Create a `.env` file in the `backend/` directory for configuration:

```env
# Ollama Configuration
OLLAMA_HOST=localhost:11434
OLLAMA_MODEL=mistral

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# Embedding Configuration
CHUNK_SIZE=500
CHUNK_OVERLAP=100
RETRIEVAL_K=5
```

## Architecture Overview

### Backend Architecture
```
FastAPI Application
├── Routes (HTTP endpoints)
│   ├── /api/chat/* (messaging)
│   ├── /api/documents/* (document management)
│   └── /api/health (health check)
├── Services (business logic)
│   ├── RAGService (orchestration)
│   ├── EmbeddingService (vector storage)
│   └── LLMService (model integration)
└── Data
    └── ChromaDB (vector storage)
```

### Frontend Architecture
```
React Application
├── Components
│   ├── ChatBox (main chat interface)
│   ├── DocumentUpload (file upload)
│   └── Sidebar (stats and navigation)
├── Services
│   └── api.ts (API client)
└── Styles (CSS styling)
```

## Data Flow

### Document Upload Flow
```
1. User selects file
2. File sent to /api/documents/upload
3. Backend extracts text
4. Text split into chunks
5. Chunks embedded and stored in ChromaDB
6. Success response with stats
```

### Chat Flow
```
1. User types message
2. Query sent to /api/chat/query
3. Backend retrieves relevant chunks
4. LLM generates response using context
5. Response with sources sent back
6. Frontend displays message and sources
```

## Performance Considerations

### Chunk Size
- Smaller chunks (300-500): Better precision, more API calls
- Larger chunks (1000+): Broader context, fewer calls
- Default: 500 tokens

### Retrieval Results
- Returning more chunks increases accuracy but also latency
- Default: 5 chunks per query
- Adjust in `rag.py` retrieve_relevant_chunks()

### Model Selection
- Fast models: mistral, neural-chat
- Accurate models: llama2, neural-chat-7b
- Speed vs accuracy tradeoff

## Database

### ChromaDB Location
- Stored in: `backend/data/chroma/`
- Persistent across sessions
- SQLite backend for metadata

### Clearing Database
To reset and start fresh:
```bash
# Delete the data directory
rm -rf backend/data/chroma/

# Or through API (when implemented)
curl -X POST http://localhost:8000/api/admin/clear
```

## API Documentation

### Interactive API Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Example Requests

**Upload Document:**
```bash
curl -X POST http://localhost:8000/api/documents/upload \
  -F "file=@document.pdf"
```

**Send Message:**
```bash
curl -X POST http://localhost:8000/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is in the document?"}'
```

## Development Tips

### Adding a New Feature
1. Create model in `app/models.py`
2. Implement service logic
3. Add route in `app/routes/`
4. Create React component if needed
5. Test via API docs

### Debugging
- Check backend logs in terminal
- Check browser console for frontend errors
- Use API docs at http://localhost:8000/docs
- Use browser DevTools (F12)

### Testing
- Manual testing via UI
- API testing via Swagger UI
- Load testing with multiple uploads

## Production Deployment

### Before Production:
- [ ] Set `allow_origins` to specific domains in main.py
- [ ] Use environment variables for sensitive data
- [ ] Enable authentication/authorization
- [ ] Add rate limiting
- [ ] Setup logging
- [ ] Use production ASGI server (Gunicorn + Uvicorn)
- [ ] Build frontend for production
- [ ] Setup monitoring

### Docker Deployment:
```dockerfile
# See Dockerfile templates for backend and frontend
```

## Support & Contributions

For issues or feature requests, please refer to the main README.
