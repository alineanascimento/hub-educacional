from app.repositories.material_repository import MaterialRepository
from app.schemas.material_schema import MaterialCreate, MaterialUpdate
from uuid import UUID
from fastapi import HTTPException

class MaterialService:
    def __init__(self, repository: MaterialRepository):
        self.repository = repository

    def get_all(self, skip: int = 0, limit: int = 20):
        return self.repository.get_all(skip=skip, limit=limit)

    def get_by_id(self, material_id: UUID):
        material = self.repository.get_by_id(material_id)
        if not material:
            raise HTTPException(status_code=404, detail="Material not found")
        return material

    def create(self, material: MaterialCreate):
        normalized = material.resource_type.strip().capitalize()
        if normalized not in ["Video", "Pdf", "Link"]:
            raise HTTPException(status_code=400, detail="Invalid resource_type. Must be Video, PDF or Link")
        material.resource_type = normalized
        return self.repository.create(material)

    def update(self, material_id: UUID, material: MaterialUpdate):
        self.get_by_id(material_id)
        return self.repository.update(material_id, material)

    def delete(self, material_id: UUID):
        self.get_by_id(material_id)
        return self.repository.delete(material_id)