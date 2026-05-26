from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.services.rag import RAGService

router = APIRouter(prefix="/api/chat", tags=["chat"])
rag_service = RAGService()

@router.post("/query", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process a chat query with RAG"""
    try:
        result = rag_service.process_query(
            query=request.query,
            conversation_id=request.conversation_id
        )
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversation/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history"""
    try:
        messages = rag_service.get_conversation(conversation_id)
        return {"conversation_id": conversation_id, "messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
