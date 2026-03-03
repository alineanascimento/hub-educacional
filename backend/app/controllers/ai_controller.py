from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import anthropic
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

AIRouter = APIRouter(prefix="/ai", tags=["AI"])

class AIRequest(BaseModel):
    title: str
    resource_type: str

class AIResponse(BaseModel):
    description: str
    tags: list[str]

@AIRouter.post("/suggest", response_model=AIResponse)
def suggest(request: AIRequest):
    try:
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            system="""Você é um Assistente Pedagógico especializado em materiais educacionais.
Responda APENAS com JSON válido, sem texto adicional, no formato:
{"description": "descrição do material", "tags": ["tag1", "tag2", "tag3"]}""",
            messages=[
                {
                    "role": "user",
                    "content": f"Gere uma descrição educacional e 3 tags para o material: Título: {request.title}, Tipo: {request.resource_type}"
                }
            ]
        )
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        result = json.loads(text.strip())
        return AIResponse(**result)
    except Exception as e:
        print(f"ERRO: {e}")
        raise HTTPException(status_code=500, detail=str(e))