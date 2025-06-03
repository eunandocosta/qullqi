# recibo/init_db.py
from app.database.connection import engine, Base
from app.models import recibo  # certifique-se que este arquivo define a classe Recibo

print("🔄 Criando tabelas no banco de dados...")
Base.metadata.create_all(bind=engine)
print("✅ Tabelas criadas com sucesso.")
