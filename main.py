from fastapi import FastAPI, Request
import mysql.connector
from mysql.connector import Error
import os

app = FastAPI()

db_config = {
    'host': os.getenv("MYSQLHOST"),
    'user': os.getenv("MYSQLUSER"),
    'password': os.getenv("MYSQLPASSWORD"),
    'database': os.getenv("MYSQLDATABASE"),
    'port': int(os.getenv("MYSQLPORT", 3306))
}

@app.post("/webhook-forms")
async def receber_dados_forms(request: Request):
    try:
        # 1. Pega os dados enviados pelo Google Forms
        dados = await request.json()
        nome = dados.get('nome')
        telefone = dados.get('telefone')
        documento = dados.get('documento')

        # 2. Conecta ao Banco de Dados
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # 3. Executa o INSERT na sua tabela 'clientes'
        sql_query = """
        INSERT INTO clientes (nome_completo, telefone, documento, status_cliente)
        VALUES (%s, %s, %s, 'PENDENTE')
        """
        cursor.execute(sql_query, (nome, telefone, documento))
        connection.commit()

        print(f"✅ Cliente {nome} cadastrado com sucesso!")
        return {"status": "sucesso", "mensagem": "Cliente salvo no banco"}

    except Error as e:
        print(f"❌ Erro ao inserir no MySQL: {e}")
        return {"status": "erro", "mensagem": str(e)}
    
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Para rodar: uvicorn main:app --reload