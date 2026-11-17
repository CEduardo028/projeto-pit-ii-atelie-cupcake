# Ateliê Cupcake — versão melhorada (PIT II)

Aplicação demonstrativa desenvolvida com Python/Flask, HTML, CSS e JavaScript.

## Funcionalidades
- Cardápio com cinco sabores: Ninho, Beijinho, Dois Amores, Prestígio e Chocolate.
- Busca por nome/descrição e filtros por categoria.
- Carrinho com quantidade, subtotal e remoção individual de itens.
- Finalização com nome, telefone e campo opcional de observações.
- Validação do pedido no servidor Flask.
- Tela separada de pedidos registrados, com histórico no navegador.

## Como executar
1. Abra esta pasta no VS Code.
2. No terminal, crie o ambiente: `python -m venv .venv`
3. Ative o ambiente (Windows): `.venv\\Scripts\\activate`
4. Instale as dependências: `pip install -r requirements.txt`
5. Inicie: `python app.py`
6. Acesse `http://127.0.0.1:5000`.

## Observação sobre armazenamento
Os pedidos ficam no `localStorage` do navegador. Portanto, são mantidos naquele navegador/dispositivo e não formam um banco de dados centralizado nem sincronizam entre dispositivos. O Flask valida os dados enviados, mas não persiste os pedidos no servidor. Essa limitação deve ser mencionada na apresentação acadêmica.

Os valores dos sabores são fictícios e podem ser alterados no vetor `PRODUTOS`, em `app.py`.
