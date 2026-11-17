const produtos = [{"id": 1, "nome": "Ninho", "preco": 10.0}, {"id": 2, "nome": "Beijinho", "preco": 9.5}, {"id": 3, "nome": "Dois Amores", "preco": 10.5}, {"id": 4, "nome": "Prestígio", "preco": 10.0}, {"id": 5, "nome": "Chocolate", "preco": 9.5}];
let carrinho = [];
let categoriaAtiva = 'Todas';
const moeda = n => n.toLocaleString('pt-BR', {style:'currency',currency:'BRL'});

function adicionar(id) {
  const produto = produtos.find(p => p.id === id);
  const item = carrinho.find(i => i.produto_id === id);
  if (item) item.quantidade = Math.min(50, item.quantidade + 1);
  else carrinho.push({produto_id:id, nome:produto.nome, preco:produto.preco, quantidade:1});
  renderCarrinho();
}
function alterarQuantidade(id, delta) {
  const item = carrinho.find(i => i.produto_id === id);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade <= 0) remover(id);
  else if (item.quantidade <= 50) renderCarrinho();
  else item.quantidade = 50;
  renderCarrinho();
}
function remover(id) {
  carrinho = carrinho.filter(i => i.produto_id !== id);
  renderCarrinho();
}
function renderCarrinho() {
  const alvo = document.getElementById('itensCarrinho');
  alvo.innerHTML = '';
  carrinho.forEach(item => {
    const linha = document.createElement('article');
    linha.className = 'cart-item';
    const info = document.createElement('div');
    info.className = 'cart-item-info';
    const nome = document.createElement('strong'); nome.textContent = item.nome;
    const preco = document.createElement('span'); preco.textContent = `${moeda(item.preco)} cada`;
    info.append(nome, preco);
    const controles = document.createElement('div'); controles.className = 'quantity-controls';
    const menos = document.createElement('button'); menos.type = 'button'; menos.textContent = '−'; menos.setAttribute('aria-label', `Diminuir ${item.nome}`); menos.addEventListener('click', () => alterarQuantidade(item.produto_id, -1));
    const qtd = document.createElement('span'); qtd.textContent = item.quantidade;
    const mais = document.createElement('button'); mais.type = 'button'; mais.textContent = '+'; mais.setAttribute('aria-label', `Aumentar ${item.nome}`); mais.addEventListener('click', () => alterarQuantidade(item.produto_id, 1));
    controles.append(menos, qtd, mais);
    const subtotal = document.createElement('strong'); subtotal.className = 'item-subtotal'; subtotal.textContent = moeda(item.preco * item.quantidade);
    const excluir = document.createElement('button'); excluir.type = 'button'; excluir.className = 'remove-item'; excluir.textContent = 'Remover'; excluir.addEventListener('click', () => remover(item.produto_id));
    linha.append(info, controles, subtotal, excluir); alvo.appendChild(linha);
  });
  const total = carrinho.reduce((s,i) => s + i.preco * i.quantidade, 0);
  document.getElementById('totalCarrinho').textContent = moeda(total);
  document.getElementById('contadorCarrinho').textContent = carrinho.reduce((s,i)=>s+i.quantidade,0);
  document.getElementById('carrinhoVazio').hidden = carrinho.length > 0;
}

function mostrarTela(nome) {
  document.getElementById('cardapio').hidden = nome !== 'cardapio';
  document.getElementById('telaCarrinho').hidden = nome !== 'carrinho';
  document.getElementById('telaPedidos').hidden = nome !== 'pedidos';
  document.getElementById('inicio').hidden = nome !== 'cardapio';
  if (nome === 'pedidos') renderHistorico();
  window.scrollTo({top:0, behavior:'smooth'});
}
function renderHistorico() {
  const alvo = document.getElementById('historicoLista');
  const pedidos = JSON.parse(localStorage.getItem('pedidosCupcake') || '[]');
  alvo.innerHTML = '';
  if (!pedidos.length) {
    const vazio = document.createElement('p'); vazio.className = 'muted'; vazio.textContent = 'Nenhum pedido registrado ainda.'; alvo.appendChild(vazio); return;
  }
  pedidos.slice().reverse().forEach(pedido => {
    const card = document.createElement('article'); card.className = 'order-card';
    const topo = document.createElement('div'); topo.className = 'order-top';
    const codigo = document.createElement('strong'); codigo.textContent = pedido.codigo;
    const status = document.createElement('span'); status.className = 'status'; status.textContent = pedido.status;
    topo.append(codigo,status);
    const cliente = document.createElement('p'); cliente.textContent = `${pedido.cliente} · ${pedido.telefone}`;
    const data = document.createElement('small'); data.textContent = pedido.data;
    const itens = document.createElement('p'); itens.textContent = pedido.itens.map(i => `${i.nome} × ${i.quantidade}`).join(' · ');
    const obs = document.createElement('p'); obs.className = 'order-observation'; obs.textContent = pedido.observacao ? `Observação: ${pedido.observacao}` : 'Sem observações.';
    const total = document.createElement('strong'); total.className = 'order-total'; total.textContent = `Total: ${moeda(pedido.total)}`;
    card.append(topo,cliente,data,itens,obs,total); alvo.appendChild(card);
  });
}

function filtrarProdutos() {
  const termo = document.getElementById('buscaSabor').value.trim().toLocaleLowerCase('pt-BR');
  let visiveis = 0;
  document.querySelectorAll('.produto').forEach(card => {
    const combinaTexto = card.dataset.nome.includes(termo) || card.textContent.toLocaleLowerCase('pt-BR').includes(termo);
    const combinaCategoria = categoriaAtiva === 'Todas' || card.dataset.categoria === categoriaAtiva;
    const mostrar = combinaTexto && combinaCategoria;
    card.hidden = !mostrar;
    if (mostrar) visiveis++;
  });
  document.getElementById('semResultados').hidden = visiveis > 0;
}

document.getElementById('buscaSabor').addEventListener('input', filtrarProdutos);
document.getElementById('filtrosCategoria').addEventListener('click', event => {
  const botao = event.target.closest('button[data-categoria]');
  if (!botao) return;
  categoriaAtiva = botao.dataset.categoria;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === botao));
  filtrarProdutos();
});
document.getElementById('abrirCarrinho').addEventListener('click', () => mostrarTela('carrinho'));
document.getElementById('abrirPedidos').addEventListener('click', () => mostrarTela('pedidos'));
document.querySelectorAll('[data-voltar]').forEach(b => b.addEventListener('click', () => mostrarTela('cardapio')));
document.getElementById('checkoutForm').addEventListener('submit', async event => {
  event.preventDefault();
  const cliente = document.getElementById('cliente').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const observacao = document.getElementById('observacao').value.trim();
  const mensagem = document.getElementById('mensagem');
  if (!carrinho.length) { mensagem.textContent = 'Adicione pelo menos um sabor ao carrinho.'; return; }
  try {
    const resposta = await fetch('/api/validar-pedido', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cliente,telefone,observacao,itens:carrinho})});
    const resultado = await resposta.json();
    if (!resposta.ok) { mensagem.textContent = resultado.mensagem; return; }
    const pedidos = JSON.parse(localStorage.getItem('pedidosCupcake') || '[]');
    const pedido = {codigo:'PED-'+Date.now().toString().slice(-7),cliente,telefone,observacao,itens:carrinho.map(i=>({...i})),total:resultado.total,status:'Recebido',data:new Date().toLocaleString('pt-BR')};
    pedidos.push(pedido); localStorage.setItem('pedidosCupcake',JSON.stringify(pedidos));
    carrinho = []; renderCarrinho(); event.target.reset();
    mensagem.textContent = `Pedido ${pedido.codigo} registrado com sucesso!`;
    setTimeout(() => mostrarTela('pedidos'), 900);
  } catch (erro) { mensagem.textContent = 'Não foi possível validar o pedido. Verifique se o servidor está ativo.'; }
});
renderCarrinho();
