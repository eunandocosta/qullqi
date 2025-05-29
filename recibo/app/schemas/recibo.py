from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReciboCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    valor: float

class ReciboOut(ReciboCreate):
    id: int
    codigo_unico: str
    caminho_arquivo: str
    data_envio: datetime

    class Config:
        from_attributes = True
