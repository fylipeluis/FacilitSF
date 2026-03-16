from fastapi import FastAPI, Request
from mysql.connector import Error
from database.connection import conectar

app = FastAPI()

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
        if connection.is_connected():
            cursor.close()
            connection.close()