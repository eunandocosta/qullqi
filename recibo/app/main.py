from fastapi import FastAPI
from app.routers import recibos
from app.database.connection import engine
from app.models.recibo import Base

app = FastAPI()
Base.metadata.create_all(bind=engine)
app.include_router(recibos.router)

@app.get("/")
async def root():
    return {"mensagem": "API rodando com sucesso!"}