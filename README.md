# Projeto PIT II — Sistema de Pedidos para Loja de Cupcakes

## Sobre o projeto

Este projeto foi desenvolvido como parte da atividade PIT II do curso de Engenharia de Software.

O sistema tem como objetivo facilitar a apresentação dos produtos e o registro de pedidos de uma loja fictícia de cupcakes gourmet, oferecendo uma interface simples e organizada para a escolha dos sabores e a realização de pedidos.

## Organização do projeto

O repositório está dividido em duas versões:

### 01 — Versão inicial

Primeira implementação do sistema, com funcionalidades básicas para visualizar os produtos, selecionar itens e realizar pedidos.

### 02 — Versão melhorada

Versão atualizada do sistema, com melhorias na interface e na experiência de utilização, incluindo:

- Catálogo com diferentes sabores de cupcakes.
- Pesquisa de produtos por nome.
- Filtros por categorias.
- Carrinho de compras.
- Controle de quantidade dos produtos.
- Remoção individual de itens do carrinho.
- Campo de observações na finalização do pedido.
- Tela separada para consulta dos pedidos registrados.

## Tecnologias utilizadas

- Python
- Flask
- HTML5
- CSS3
- JavaScript
- LocalStorage

## Como executar o projeto

É necessário ter Python instalado no computador.

1. Acesse a pasta da versão que deseja executar.
2. Abra o terminal nessa pasta.
3. Crie um ambiente virtual:

```bash
python -m venv .venv
```

4. Ative o ambiente virtual.

**Windows:**

```bash
.venv\Scripts\activate
```

5. Instale as dependências:

```bash
pip install -r requirements.txt
```

6. Execute a aplicação:

```bash
python app.py
```

7. Acesse pelo navegador:

http://127.0.0.1:5000

## Armazenamento dos pedidos

A aplicação utiliza o LocalStorage do navegador para armazenar os pedidos registrados. Dessa forma, os dados ficam salvos localmente no navegador utilizado, sem depender de um banco de dados externo.

## Objetivo acadêmico

O desenvolvimento contempla a implementação de uma solução de software, permitindo demonstrar a evolução entre uma versão inicial e uma versão melhorada, considerando organização, usabilidade e funcionalidades do sistema.
