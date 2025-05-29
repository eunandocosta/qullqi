from fastapi import APIRouter, UploadFile, File, Form, Query
from app.services.recibo_service import salvar_recibo_com_arquivo
from app.schemas.recibo import ReciboOut
from sqlalchemy import and_
from datetime import datetime

router = APIRouter(prefix="/recibos", tags=["Recibos"])

@router.post("/upload", response_model=ReciboOut)
async def criar_recibo_com_arquivo(
    titulo: str = Form(...),
    descricao: str = Form(None),
    valor: float = Form(...),
    arquivo: UploadFile = File(...)
):
    return salvar_recibo_com_arquivo(titulo, descricao, valor, arquivo)

###ADICIONANDO LISTAGEM DE RECIBOS###

from app.database.connection import SessionLocal
from app.models.recibo import Recibo
from typing import List
from fastapi import Depends
from app.schemas.recibo import ReciboOut

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[ReciboOut])
def listar_recibos(
    db=Depends(get_db),
    titulo: str = Query(None),
    valor_min: float = Query(None),
    valor_max: float = Query(None),
    data_inicial: datetime = Query(None),
    data_final: datetime = Query(None)
):
    query = db.query(Recibo)

    if titulo:
        query = query.filter(Recibo.titulo.ilike(f"%{titulo}%"))
    if valor_min:
        query = query.filter(Recibo.valor >= valor_min)
    if valor_max:
        query = query.filter(Recibo.valor <= valor_max)
    if data_inicial:
        query = query.filter(Recibo.data_envio >= data_inicial)
    if data_final:
        query = query.filter(Recibo.data_envio <= data_final)

    return query.all()

###DOWNLOAD RECIBO###

from fastapi.responses import FileResponse
import os
from fastapi import HTTPException

@router.get("/download/{codigo}")
def baixar_arquivo(codigo: str, db=Depends(get_db)):
    recibo = db.query(Recibo).filter(Recibo.codigo_unico == codigo).first()
    if not recibo:
        raise HTTPException(status_code=404, detail="Recibo não encontrado")
    if not os.path.exists(recibo.caminho_arquivo):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    return FileResponse(recibo.caminho_arquivo, media_type="application/octet-stream", filename=os.path.basename(recibo.caminho_arquivo))


###DELETAR RECIBOS###

from fastapi import status

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_recibo(id: int, db=Depends(get_db)):
    recibo = db.query(Recibo).filter(Recibo.id == id).first()
    if not recibo:
        raise HTTPException(status_code=404, detail="Recibo não encontrado")

    # Remover o arquivo físico se existir
    if os.path.exists(recibo.caminho_arquivo):
        os.remove(recibo.caminho_arquivo)

    db.delete(recibo)
    db.commit()

###DOWNLOAD RELATÓRIOS###

from app.services.relatorio_service import (
    listar_dados_para_relatorio,
    gerar_csv, gerar_excel, gerar_pdf
)
from fastapi.responses import FileResponse

@router.get("/relatorio/{formato}")
def baixar_relatorio(
    formato: str,
    titulo: str = Query(None),
    valor_min: float = Query(None),
    valor_max: float = Query(None),
    data_inicial: datetime = Query(None),
    data_final: datetime = Query(None),
    db=Depends(get_db)
):
    filtros = {
        "titulo": titulo,
        "valor_min": valor_min,
        "valor_max": valor_max,
        "data_inicial": data_inicial,
        "data_final": data_final
    }

    data = listar_dados_para_relatorio(db, filtros)

    if formato == "csv":
        path = gerar_csv(data)
    elif formato == "excel":
        path = gerar_excel(data)
    elif formato == "pdf":
        path = gerar_pdf(data)
    else:
        raise HTTPException(status_code=400, detail="Formato inválido. Use csv, excel ou pdf.")

    return FileResponse(path, filename=path)
