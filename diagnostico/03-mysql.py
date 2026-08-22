from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

url = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:"
    f"{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:"
    f"{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}"
)

try:
    engine = create_engine(url)

    with engine.connect():
        print("Conexão realizada com sucesso!")

except Exception as erro:
    print(erro)