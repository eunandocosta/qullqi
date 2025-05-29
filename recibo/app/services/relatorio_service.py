import pandas as pd
from fpdf import FPDF
from app.models.recibo import Recibo
from sqlalchemy.orm import Session
import os

def listar_dados_para_relatorio(db: Session, filtros: dict = {}):
    query = db.query(Recibo)
    
    if filtros.get("titulo"):
        query = query.filter(Recibo.titulo.ilike(f"%{filtros['titulo']}%"))
    if filtros.get("valor_min"):
        query = query.filter(Recibo.valor >= filtros["valor_min"])
    if filtros.get("valor_max"):
        query = query.filter(Recibo.valor <= filtros["valor_max"])
    if filtros.get("data_inicial"):
        query = query.filter(Recibo.data_envio >= filtros["data_inicial"])
    if filtros.get("data_final"):
        query = query.filter(Recibo.data_envio <= filtros["data_final"])

    resultados = query.all()

    data = [{
        "ID": r.id,
        "Título": r.titulo,
        "Descrição": r.descricao,
        "Valor": r.valor,
        "Código": r.codigo_unico,
        "Data": r.data_envio.strftime("%d/%m/%Y %H:%M")
    } for r in resultados]

    return data

def gerar_csv(data, path="relatorio.csv"):
    df = pd.DataFrame(data)
    df.to_csv(path, index=False)
    return path

def gerar_excel(data, path="relatorio.xlsx"):
    df = pd.DataFrame(data)
    df.to_excel(path, index=False)
    return path

def gerar_pdf(data, path="relatorio.pdf"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=10)
    pdf.cell(200, 10, "Relatório de Recibos", ln=True, align="C")

    for r in data:
        linha = f"{r['ID']} - {r['Título']} - R$ {r['Valor']:.2f} - {r['Data']}"
        pdf.cell(200, 8, linha, ln=True)

    pdf.output(path)
    return path
