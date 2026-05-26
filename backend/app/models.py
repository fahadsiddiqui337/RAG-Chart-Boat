from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = None

class ChatRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str]
    conversation_id: str

class DocumentUpload(BaseModel):
    filename: str
    content: str

class DocumentInfo(BaseModel):
    id: str
    filename: str
    uploaded_at: datetime
    chunks: int

class ConversationHistory(BaseModel):
    conversation_id: str
    messages: List[Message]
