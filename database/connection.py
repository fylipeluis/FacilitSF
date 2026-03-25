import mysql.connector

def conectar():
    return mysql.connector.connect(
        host="hopper.proxy.rlwy.net",
        user="root",
        password="Rapha1802#",
        database="railway",
        port=35351,
        connection_timeout=10
    )