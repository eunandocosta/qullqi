from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from app.database.connection import Base

class Recibo(Base):
    __tablename__ = "recibos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    descricao = Column(String(1024), nullable=True)
    valor = Column(Float, nullable=False)
    codigo_unico = Column(String(100), unique=True, nullable=False)
    caminho_arquivo = Column(String(255), nullable=False)
    data_envio = Column(DateTime, default=lambda: datetime.now(timezone.utc))
