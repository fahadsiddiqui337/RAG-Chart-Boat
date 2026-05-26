# Quick Start Guide

## Prerequisites
- Python 3.9+
- Node.js 16+
- Ollama

## Installation & Running

### Step 1: Start Ollama
```bash
ollama serve
# In another terminal, pull a model
ollama pull mistral
```

### Step 2: Start Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
# Backend running at http://localhost:8000
```

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend running at http://localhost:3000
```

### Step 4: Use the Application
1. Open http://localhost:3000 in browser
2. Upload documents (PDF or TXT)
3. Ask questions about the documents
4. Chat history is automatically tracked

## Stopping Services
- Backend: Ctrl+C in terminal
- Frontend: Ctrl+C in terminal
- Ollama: Ctrl+C or close the window

## Troubleshooting
- If port 8000 is in use, change port in `backend/main.py`
- If port 3000 is in use, change port in `frontend/vite.config.ts`
- Ensure Ollama is running before starting backend
- Check browser console for frontend errors
- Check backend terminal for API errors
