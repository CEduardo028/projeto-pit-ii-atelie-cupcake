import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import app

def test_homepage():
    response = app.test_client().get("/")
    assert response.status_code == 200
    assert b"Cupcake" in response.data or b"cupcake" in response.data

def test_validar_pedido():
    response = app.test_client().post("/api/validar-pedido", json={
        "cliente": "Ana Silva", "telefone": "41999999999",
        "itens": [{"produto_id": 1, "quantidade": 2}]
    })
    assert response.status_code == 200
    assert response.get_json()["ok"] is True

def test_rejeitar_pedido_invalido():
    response = app.test_client().post("/api/validar-pedido", json={
        "cliente": "A", "telefone": "1", "itens": []
    })
    assert response.status_code == 400
