from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.rag import RAGService
from PyPDF2 import PdfReader
from io import BytesIO

router = APIRouter(prefix="/api/documents", tags=["documents"])
rag_service = RAGService()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document"""
    try:
        # Read file content
        contents = await file.read()
        
        # Extract text based on file type
        text = await extract_text(contents, file.filename)
        
        # Add to RAG system
        result = rag_service.add_document(
            filename=file.filename,
            content=text
        )
        
        return {
            "status": "success",
            "message": f"Document '{file.filename}' uploaded successfully",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_stats():
    """Get document and RAG statistics"""
    try:
        stats = rag_service.get_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def extract_text(contents: bytes, filename: str) -> str:
    """Extract text from various file formats"""
    if filename.endswith('.pdf'):
        return extract_pdf_text(contents)
    elif filename.endswith('.txt'):
        return contents.decode('utf-8')
    else:
        raise ValueError(f"Unsupported file format: {filename}")

def extract_pdf_text(contents: bytes) -> str:
    """Extract text from PDF"""
    try:
        pdf_reader = PdfReader(BytesIO(contents))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise ValueError(f"Error reading PDF: {str(e)}")
