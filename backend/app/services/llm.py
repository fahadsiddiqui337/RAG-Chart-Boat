import ollama
from typing import List, Tuple

class LLMService:
    def __init__(self, model: str = "mistral"):
        """Initialize LLM service with Ollama"""
        self.model = model
        self.client = ollama.Client()
    
    def generate_response(self, query: str, context: List[Tuple[str, str]]) -> str:
        """Generate response using Ollama with RAG context"""
        # Build context string from retrieved documents
        context_text = "\n---\n".join([f"Source: {source}\n{content}" for content, source, _ in context])
        
        # Create prompt
        prompt = f"""Based on the following context, answer the user's question. If the context doesn't contain relevant information, say so.

CONTEXT:
{context_text}

USER QUESTION:
{query}

ANSWER:"""
        
        try:
            response = self.client.generate(
                model=self.model,
                prompt=prompt,
                stream=False
            )
            return response['response']
        except Exception as e:
            return f"Error generating response: {str(e)}"
    
    def check_model_available(self) -> bool:
        """Check if the model is available"""
        try:
            self.client.generate(
                model=self.model,
                prompt="test",
                stream=False
            )
            return True
        except Exception:
            return False

    def list_available_models(self) -> List[str]:
        """List available models in Ollama"""
        try:
            response = self.client.list()
            return [model['name'] for model in response.get('models', [])]
        except Exception as e:
            return [f"Error listing models: {str(e)}"]
