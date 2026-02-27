from sqlite3 import dbapi2
from sqlalchemy.orm import Session
from app.models.material_model import Material
from app.schemas.material_schema import MaterialCreate, MaterialUpdate
from uuid import UUID


class MaterialRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 20):
        return self.db.query(Material).offset(skip).limit(limit).all()
    
    def get_by_id(self, material_id: UUID):
        return self.db.query(Material).filter(Material.id == material_id).first()
    
    def create(self, material: MaterialCreate):
        db_material = Material(**material.model_dump())
        self.db.add(db_material)
        self.db.commit()
        self.db.refresh(db_material)
        return db_material
    
    def update(self, material_id: UUID, material_update: MaterialUpdate):
        db_material = self.get_by_id(material_id)
        if not db_material:
            return None
        for key, value in material_update.model_dump(exclude_unset=True).items():
            setattr(db_material, key, value)
        self.db.commit()
        self.db.refresh(db_material)
        return db_material
    
    def delete(self, material_id: UUID):
        db_material = self.get_by_id(material_id)
        if not db_material:
            return None
        self.db.delete(db_material)
        self.db.commit()
        return db_material
