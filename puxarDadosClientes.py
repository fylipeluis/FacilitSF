from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import Error
from database.connection import conectar

app = FastAPI()

origins = ["https://facilitsf-production.up.railway.app/clientes"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/webhook-forms")
async def receber_dados_forms(request: Request):

    connection = None
    cursor = None

    try:
        dados = await request.json()

        nome = dados.get("nome")
        telefone = dados.get("telefone")
        documento = dados.get("documento")

        connection = conectar()
        cursor = connection.cursor()

        sql = """
        INSERT INTO clientes (nome_completo, telefone, documento, status_cliente)
        VALUES (%s, %s, %s, 'PENDENTE')
        """

        cursor.execute(sql, (nome, telefone, documento))
        connection.commit()

        print(f"✅ Cliente {nome} cadastrado com sucesso!")
        return {"status": "sucesso", "mensagem": "Cliente salvo no banco"}

    except Error as e:
        print(f"❌ Erro ao inserir no MySQL: {e}")
        return {"status": "erro", "mensagem": str(e)}
    
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
    
@app.get("/clientes")
def listar_clientes():
    connection = conectar()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM clientes")
    resultados = cursor.fetchall()

    cursor.close()
    connection.close()

    return resultados