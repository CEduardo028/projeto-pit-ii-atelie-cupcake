const produtos = [{"id": 1, "nome": "Brigadeiro Belga", "preco": 9.5}, {"id": 2, "nome": "Red Velvet", "preco": 11.0}, {"id": 3, "nome": "Baunilha com Morango", "preco": 10.0}, {"id": 4, "nome": "Doce de Leite", "preco": 10.5}];
let carrinho = [];
const moeda = n => n.toLocaleString('pt-BR', {style:'currency',currency:'BRL'});
function adicionar(id){
  const p = produtos.find(x => x.id === id);
  const item = carrinho.find(x => x.produto_id === id);
  if(item) item.quantidade++;
  else carrinho.push({produto_id:id, quantidade:1, nome:p.nome, preco:p.preco});
  renderCarrinho();
}
function remover(id){
  carrinho = carrinho.filter(x => x.produto_id !== id);
  renderCarrinho();
}
function renderCarrinho(){
  const el = document.getElementById('itens');
  el.innerHTML = '';
  carrinho.forEach(i => {
    const row = document.createElement('div');
    row.className = 'linha';
    row.innerHTML = `<span>${i.nome} × ${i.quantidade}</span><span>${moeda(i.preco*i.quantidade)} <button type="button" aria-label="Remover" onclick="remover(${i.produto_id})">×</button></span>`;
    el.appendChild(row);
  });
  const total = carrinho.reduce((s,i)=>s+i.preco*i.quantidade,0);
  const totalEl = document.getElementById('total');
  totalEl.textContent = totalEl.tagName === 'P' ? `Total: ${moeda(total)}` : moeda(total);
}
function renderHistorico(){
  const alvo = document.getElementById('historicoLista') || document.getElementById('historico');
  const pedidos = JSON.parse(localStorage.getItem('pedidosCupcake') || '[]');
  alvo.innerHTML = pedidos.length ? '' : '<p class="muted">Nenhum pedido registrado ainda.</p>';
  pedidos.slice().reverse().forEach(p=>{
    const div=document.createElement('div'); div.className='pedido-card';
    div.textContent = `${p.codigo} · ${p.cliente} · ${moeda(p.total)} · ${p.status}`;
    alvo.appendChild(div);
  });
}
const form = document.getElementById('checkoutForm') || document.getElementById('checkout');
form.addEventListener('submit', async e=>{
  e.preventDefault();
  const cliente=document.getElementById('cliente').value.trim();
  const telefone=document.getElementById('telefone').value.trim();
  const mensagem=document.getElementById('mensagem');
  if(!carrinho.length){mensagem.textContent='Adicione ao menos um produto antes de finalizar.';return;}
  try{
    const resp=await fetch('/api/validar-pedido',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cliente,telefone,itens:carrinho})});
    const resultado=await resp.json();
    if(!resp.ok){mensagem.textContent=resultado.mensagem;return;}
    const pedidos=JSON.parse(localStorage.getItem('pedidosCupcake')||'[]');
    const pedido={codigo:'PED-'+Date.now().toString().slice(-7),cliente,telefone,itens:carrinho.map(i=>({...i})),total:resultado.total,status:'Recebido',data:new Date().toLocaleString('pt-BR')};
    pedidos.push(pedido);localStorage.setItem('pedidosCupcake',JSON.stringify(pedidos));
    mensagem.textContent=`Pedido ${pedido.codigo} registrado com sucesso!`;
    carrinho=[];renderCarrinho();form.reset();renderHistorico();
  }catch(err){mensagem.textContent='Não foi possível validar o pedido. Verifique se o servidor está ativo.';}
});
renderCarrinho();renderHistorico();
