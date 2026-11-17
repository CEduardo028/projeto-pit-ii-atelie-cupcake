from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

PRODUTOS = [
    {"id": 1, "nome": "Brigadeiro Belga", "descricao": "Massa de chocolate com cobertura cremosa.", "preco": 9.50, "categoria": "Chocolate", "emoji": "🍫"},
    {"id": 2, "nome": "Red Velvet", "descricao": "Massa red velvet com creme suave.", "preco": 11.00, "categoria": "Especiais", "emoji": "❤️"},
    {"id": 3, "nome": "Baunilha com Morango", "descricao": "Baunilha, morangos e cobertura leve.", "preco": 10.00, "categoria": "Frutas", "emoji": "🍓"},
    {"id": 4, "nome": "Doce de Leite", "descricao": "Recheio de doce de leite e toque de canela.", "preco": 10.50, "categoria": "Especiais", "emoji": "🧁"}
]

@app.get("/")
def inicio():
    return render_template("index.html", produtos=PRODUTOS, melhorada=False)

@app.get("/api/produtos")
def listar_produtos():
    return jsonify(PRODUTOS)

@app.post("/api/validar-pedido")
def validar_pedido():
    dados = request.get_json(silent=True) or {}
    cliente = (dados.get("cliente") or "").strip()
    telefone = (dados.get("telefone") or "").strip()
    itens = dados.get("itens") or []
    if len(cliente) < 3:
        return jsonify({"ok": False, "mensagem": "Informe o nome do cliente (mínimo de 3 caracteres)."}), 400
    if len(telefone) < 8:
        return jsonify({"ok": False, "mensagem": "Informe um telefone válido."}), 400
    if not isinstance(itens, list) or not itens:
        return jsonify({"ok": False, "mensagem": "Adicione pelo menos um produto ao pedido."}), 400
    total = 0
    for item in itens:
        try:
            pid, qtd = int(item.get("produto_id")), int(item.get("quantidade"))
        except (TypeError, ValueError, AttributeError):
            return jsonify({"ok": False, "mensagem": "Há um item inválido no pedido."}), 400
        produto = next((p for p in PRODUTOS if p["id"] == pid), None)
        if produto is None or qtd < 1 or qtd > 50:
            return jsonify({"ok": False, "mensagem": "Produto ou quantidade inválida."}), 400
        total += produto["preco"] * qtd
    return jsonify({"ok": True, "total": round(total, 2), "mensagem": "Pedido validado com sucesso."})

if __name__ == "__main__":
    app.run(debug=True)
