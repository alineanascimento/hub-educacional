from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import anthropic
import os
import json
import logging
import time
import threading
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

AIRouter = APIRouter(prefix="/ai", tags=["AI"])


class RateLimiter:
    def __init__(self, max_calls: int, period_seconds: int):
        self.max_calls = max_calls
        self.period = period_seconds
        self.lock = threading.Lock()
        self.calls: list[float] = []

    def allow(self) -> tuple[bool, int]:
        now = time.time()
        with self.lock:
            self.calls = [t for t in self.calls if now - t < self.period]
            if len(self.calls) < self.max_calls:
                self.calls.append(now)
                return True, 0
            retry_after = int(self.period - (now - self.calls[0])) + 1
            return False, retry_after


global_rate_limiter = RateLimiter(max_calls=1, period_seconds=3)


class AIRequest(BaseModel):
    title: str
    resource_type: str


class AIResponse(BaseModel):
    description: str
    tags: list[str]


@AIRouter.post("/suggest", response_model=AIResponse)
def suggest(payload: AIRequest, request: Request):
    allowed, retry_after = global_rate_limiter.allow()
    if not allowed:
        client_ip = request.client.host if request.client else "unknown"
        logger.warning(
            f"Rate limit exceeded | IP: {client_ip} | Retry-After: {retry_after}s"
        )
        raise HTTPException(
            status_code=429,
            detail=f"Limite de requisições atingido. Tente novamente em {retry_after}s.",
            headers={"Retry-After": str(retry_after)},
        )

    try:
        start_time = time.time()
        
        logger.info(
            f"AI Request Started | Title: '{payload.title}' | Type: '{payload.resource_type}'"
        )

        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            system="""Você é um Assistente Pedagógico especializado em materiais educacionais.
Responda APENAS com JSON válido, sem markdown, sem blocos de código, sem texto adicional:
{"description": "descrição do material", "tags": ["tag1", "tag2", "tag3"]}""",
            messages=[
                {
                    "role": "user",
                    "content": f"Gere uma descrição educacional e 3 tags para o material: Título: {payload.title}, Tipo: {payload.resource_type}",
                }
            ],
        )

        latency = round(time.time() - start_time, 2)
        token_usage = (
            message.usage.input_tokens + message.usage.output_tokens
        )

        logger.info(
            f"AI Success | Title: '{payload.title}' | TokenUsage: {token_usage} | Latency: {latency}s"
        )

        text = message.content[0].text.strip()
        logger.debug(f"Raw AI Response: {text[:200]}")
        
        if text.startswith("```json"):
            text = text.split("```json")[1].split("```")[0].strip()
        elif text.startswith("```"):
            text = text.split("```")[1].split("```")[0].strip()

        result = json.loads(text)
        
        if not isinstance(result, dict) or "description" not in result or "tags" not in result:
            raise ValueError("Invalid response structure from AI")

        return AIResponse(**result)

    except json.JSONDecodeError as e:
        logger.error(f"JSON Parse Error | Title: '{payload.title}' | Error: {str(e)} | Text: {text[:100]}")
        raise HTTPException(
            status_code=502,
            detail="A IA retornou um formato inválido. Tente novamente.",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(
            f"Unexpected Error | Title: '{payload.title}' | Error: {str(e)}"
        )
        error_msg = str(e).lower()
        if "api" in error_msg or "key" in error_msg or "auth" in error_msg:
            detail = "Erro de autenticação com a IA. Verifique a chave da API."
        elif "rate limit" in error_msg or "quota" in error_msg:
            detail = "Limite de requisições atingido. Aguarde um momento e tente novamente."
        else:
            detail = "Erro ao conectar com o serviço de IA. Tente novamente mais tarde."
        raise HTTPException(status_code=500, detail=detail)
