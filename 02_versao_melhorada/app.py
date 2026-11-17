from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Cardápio fictício para a demonstração acadêmica. Os preços podem ser ajustados.
PRODUTOS = [
    {"id": 1, "nome": "Ninho", "descricao": "Brigadeiro com recheio cremoso de leite Ninho.", "preco": 10.00, "categoria": "Leite", "emoji": "🥛"},
    {"id": 2, "nome": "Beijinho", "descricao": "Massa de coco com brigadeiro branco cremoso.", "preco": 9.50, "categoria": "Coco", "emoji": "🥥"},
    {"id": 3, "nome": "Dois Amores", "descricao": "Combinação de brigadeiro ao leite e branco.", "preco": 10.50, "categoria": "Especiais", "emoji": "🤍"},
    {"id": 4, "nome": "Prestígio", "descricao": "Chocolate com recheio de coco.", "preco": 10.00, "categoria": "Chocolate e coco", "emoji": "🍫"},
    {"id": 5, "nome": "Chocolate", "descricao": "Massa e cobertura de chocolate cremoso.", "preco": 9.50, "categoria": "Chocolate", "emoji": "🍫"}
]

@app.get("/")
def inicio():
    categorias = sorted({produto["categoria"] for produto in PRODUTOS})
    return render_template("index.html", produtos=PRODUTOS, categorias=categorias, melhorada=True)

@app.get("/api/produtos")
def listar_produtos():
    return jsonify(PRODUTOS)

@app.post("/api/validar-pedido")
def validar_pedido():
    dados = request.get_json(silent=True) or {}
    cliente = (dados.get("cliente") or "").strip()
    telefone = (dados.get("telefone") or "").strip()
    observacao = (dados.get("observacao") or "").strip()
    itens = dados.get("itens") or []
    if len(cliente) < 3:
        return jsonify({"ok": False, "mensagem": "Informe o nome do cliente (mínimo de 3 caracteres)."}), 400
    if len(telefone) < 8:
        return jsonify({"ok": False, "mensagem": "Informe um telefone válido."}), 400
    if len(observacao) > 500:
        return jsonify({"ok": False, "mensagem": "A observação deve ter no máximo 500 caracteres."}), 400
    if not isinstance(itens, list) or not itens:
        return jsonify({"ok": False, "mensagem": "Adicione pelo menos um produto ao carrinho."}), 400
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
