from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

from pydantic_core import Url

class MaterialBase(BaseModel):
    title: str
    description: Optional[str] = None
    resource_type: str
    url: Url
    tags: Optional[List[str]] = None

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    resource_type: Optional[str] = None
    url: Optional[Url] = None
    tags: Optional[List[str]] = None


class MaterialResponse(MaterialBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True