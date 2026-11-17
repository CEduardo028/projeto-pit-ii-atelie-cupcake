# PIT II — Loja de Cupcakes Gourmet (versão inicial)

## Executar
1. Instale Python 3.10 ou superior.
2. No terminal, entre nesta pasta.
3. Execute `python -m venv .venv`.
4. Ative o ambiente virtual.
5. Execute `pip install -r requirements.txt`.
6. Execute `python app.py`.
7. Abra `http://127.0.0.1:5000`.

## Armazenamento
Os pedidos são gravados no `localStorage` do navegador. Isso mantém os dados no mesmo navegador e dispositivo. Não é um banco de dados central e não sincroniza entre computadores.

## Organização
- `app.py`: rotas Flask e validação básica dos pedidos.
- `templates/index.html`: interface.
- `static/css/style.css`: estilos.
- `static/js/app.js`: carrinho e pedidos.

## Executar testes
Após instalar as dependências, execute `pytest -q`.
