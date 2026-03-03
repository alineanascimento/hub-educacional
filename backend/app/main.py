from fastapi import FastAPI
from app.controllers.material_controller import MaterialRouter
from app.database.database import Base, engine
from app.controllers.ai_controller import AIRouter

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hub Educacional")

app.include_router(MaterialRouter)
app.include_router(AIRouter)