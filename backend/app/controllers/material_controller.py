from fastapi import APIRouter, Depends
from typing import List
from uuid import UUID

from app.services.material_service import MaterialService
from app.schemas.material_schema import MaterialCreate, MaterialUpdate, MaterialResponse
from app.repositories.material_repository import MaterialRepository
from app.database.database import get_db
from sqlalchemy.orm import Session


MaterialRouter = APIRouter(prefix=  "/materials", tags=["Materials"])

def get_material_service(db: Session = Depends(get_db)) -> MaterialService:
    repository = MaterialRepository(db)
    return MaterialService(repository)

@MaterialRouter.get("/", response_model=List[MaterialResponse])
def get_all(skip: int = 0, limit: int = 20, service: MaterialService = Depends(get_material_service)):
    return service.get_all(skip=skip, limit=limit)

@MaterialRouter.get("/{material_id}", response_model=MaterialResponse)
def get_by_id(material_id: UUID, service: MaterialService = Depends(get_material_service)):
    return service.get_by_id(material_id)


@MaterialRouter.post("/", response_model=MaterialResponse, status_code=201)
def create(material: MaterialCreate, service: MaterialService = Depends(get_material_service)):
    print("PAYLOAD RECEBIDO:", material.dict())
    return service.create(material)
@MaterialRouter.patch("/{material_id}", response_model=MaterialResponse)
def update(material_id: UUID, material: MaterialUpdate, service: MaterialService = Depends(get_material_service)):
    return service.update(material_id, material)

@MaterialRouter.delete("/{material_id}", status_code=204)
def delete(material_id: UUID, service: MaterialService = Depends(get_material_service)):
    return service.delete(material_id)