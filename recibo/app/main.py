from fastapi import FastAPI
from app.routers import recibos
from app.database.connection import engine
from app.models.recibo import Base
from app.routers.recibos import router as recibo_router 

app = FastAPI()
Base.metadata.create_all(bind=engine)
app.include_router(recibo_router)

@app.get("/")
async def root():
    return {"mensagem": "API rodando com sucesso!"}