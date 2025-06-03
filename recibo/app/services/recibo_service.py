import os
from fastapi import UploadFile
from app.models.recibo import Recibo
from app.database.connection import SessionLocal
from datetime import datetime,  timezone
import uuid
from sqlalchemy.orm import Session

UPLOAD_DIR = "uploads"

def gerar_codigo_unico():
    return str(uuid.uuid4())[:8]

def salvar_recibo_com_arquivo(titulo, descricao, valor, arquivo: UploadFile):
    db = SessionLocal()
    codigo = gerar_codigo_unico()
    
    # Salvar o arquivo no disco
    extensao = os.path.splitext(arquivo.filename)[1]
    nome_arquivo = f"{codigo}{extensao}"
    caminho_arquivo = os.path.join(UPLOAD_DIR, nome_arquivo)

    with open(caminho_arquivo, "wb") as f:
        f.write(arquivo.file.read())

    # Criar objeto e salvar no banco
    recibo = Recibo(
        titulo=titulo,
        descricao=descricao,
        valor=valor,
        codigo_unico=codigo,
        caminho_arquivo=caminho_arquivo,
        data_envio=datetime.now(timezone.utc)
    )

def listar_recibos(db: Session):
    return db.query(Recibo).all()

    db.add(recibo)
    db.commit()
    db.refresh(recibo)
    db.close()
    return recibo
