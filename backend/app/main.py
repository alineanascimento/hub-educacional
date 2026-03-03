from fastapi import FastAPI
from app.controllers.material_controller import MaterialRouter
from app.database.database import Base, engine
from app.controllers.ai_controller import AIRouter
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hub Educacional")
@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
app.include_router(MaterialRouter)
app.include_router(AIRouter)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)