# RAG Chat Board

A complete Retrieval-Augmented Generation (RAG) chat application with a Python FastAPI backend and React TypeScript frontend.

## Features

- **Document Management**: Upload PDF and TXT files
- **Smart Retrieval**: Vector-based document retrieval using Chroma
- **Chat Interface**: Real-time chat with RAG-augmented responses
- **Local LLM Support**: Integration with Ollama for local language models
- **Statistics**: Real-time tracking of documents and conversations
- **Modern UI**: Responsive React frontend with TypeScript

## Prerequisites

- Python 3.9+
- Node.js 16+
- Ollama (for local LLM support) - Download from https://ollama.ai

## Project Structure

```
RAG/
├── backend/
│   ├── app/
│   │   ├── models.py          # Pydantic models
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   └── __init__.py
│   ├── data/                  # Chroma vector database
│   ├── main.py               # FastAPI entry point
│   └── requirements.txt       # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/        # React components
    │   ├── services/          # API client
    │   ├── styles/            # CSS styles
    │   ├── App.tsx           # Main app component
    │   └── main.tsx          # Entry point
    ├── public/               # Static files
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## Setup & Installation

### 1. Setup Ollama

```bash
# Install Ollama from https://ollama.ai
# Then pull a model (e.g., Mistral)
ollama pull mistral
# Start Ollama service (it runs on http://localhost:11434 by default)
ollama serve
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Upload Documents**: Use the upload section to add PDF or TXT files
2. **Ask Questions**: Type your question in the chat box
3. **Get Answers**: Receive RAG-augmented responses with source citations
4. **Manage Conversations**: View chat history and start new conversations

## API Endpoints

### Chat
- `POST /api/chat/query` - Send a message
- `GET /api/chat/conversation/{conversation_id}` - Get conversation history

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents/stats` - Get statistics

### Health
- `GET /api/health` - Health check

## Configuration

### Backend Settings

Edit `app/services/llm.py` to change:
- LLM model (default: "mistral")
- Ollama host (default: localhost:11434)

### Frontend Settings

Edit `frontend/vite.config.ts` to change:
- API base URL
- Development server port

## Technologies Used

- **Backend**: FastAPI, Pydantic, ChromaDB, Ollama
- **Frontend**: React 18, TypeScript, Vite, Axios
- **Vector DB**: ChromaDB (persistent local storage)
- **LLM**: Ollama (local language models)

## Document Processing

- **File Types**: PDF (.pdf), Text (.txt)
- **Chunking**: Automatic text chunking with overlapping windows
- **Embedding**: Vector embeddings for semantic search
- **Retrieval**: Top-5 most relevant chunks returned for each query

## Features Explained

### RAG Architecture
1. Documents are split into chunks
2. Each chunk is converted to vectors using embeddings
3. When a user asks a question, relevant chunks are retrieved
4. The LLM uses retrieved chunks as context to generate answers

### Conversation Management
- Unique conversation IDs track chat history
- Previous messages and retrieved sources are stored
- Users can start new conversations anytime

### Vector Storage
- ChromaDB provides persistent storage
- Vector data is stored in `backend/data/chroma/`
- No external database required

## Troubleshooting

### Ollama Connection Error
- Ensure Ollama is running: `ollama serve`
- Check port 11434 is accessible
- Verify model is pulled: `ollama list`

### CORS Errors
- Backend CORS is configured for all origins (`*`)
- If issues persist, update `allow_origins` in `main.py`

### Document Upload Issues
- Check file size (very large files may timeout)
- Verify file format (PDF or TXT only)
- Check available disk space

### Empty Responses
- Ensure documents are uploaded before asking questions
- Verify Ollama model is properly loaded
- Check backend logs for errors

## Performance Tips

- Use smaller documents for faster processing
- Upload multiple documents instead of one very large file
- Adjust chunk size in `services/embeddings.py` for better results
- Use faster models (e.g., Mistral) for quicker responses

## Future Enhancements

- [ ] Document deletion and management
- [ ] Multiple language support
- [ ] Advanced search filters
- [ ] Export conversations
- [ ] Custom LLM parameters
- [ ] Web deployment configuration
- [ ] Docker containerization

## License

MIT

## Support

For issues or questions, please check the documentation or create an issue in the repository.
