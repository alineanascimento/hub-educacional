from fastapi import FastAPI
from app.controllers.material_controller import MaterialRouter
from app.database import Base, engine


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hub Educacional")

app.include_router(MaterialRouter)