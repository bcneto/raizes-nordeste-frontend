// DADOS MOCKADOS: 8 ITENS REGIONAIS COM REGRAS POR UNIDADE
const produtosBase = [
{
id: 1, 
nome: "Cuscuz Nordestino com Carne de Sol na Nata", 
preco: 19.90, 
unidades: ["recife", "campina"], 
desc: "Flocão de milho vaporizado, carne de sol desfiada e manteiga de garrafa da casa." 
},

{ 
id: 2, 
nome: "Tapioca Tradicional de Queijo Coalho tostado",
preco: 14.50,
unidades: ["recife", "salvador", "campina"],
desc: "Massa artesanal fininha, recheada com queijo coalho chapeado e coco fresco."
},

{ 
id: 3,
nome: "Bolo de Rolo Tradicional de Goiabada",
preco: 11.00,
unidades: ["recife", "salvador", "campina"],
desc: "Patrimônio cultural de Pernambuco: finíssimas camadas de massa com recheio de goiabada."
},

{
id: 4,
nome: "Bolo de Macaxeira Cremoso",
preco: 9.50,
unidades: ["recife", "salvador", "campina"],
desc: "Receita clássica de Dona Francisca, servido morno com textura super cremosa."
},

{
id: 5,
nome: "Baião de Dois com Queijo Coalho e Torresmo",
preco: 28.85,
unidades: ["recife"],
desc: "Arroz, feijão-fradinho, queijo coalho e carne seca. Exclusivo da cozinha completa da matriz."
},

{
id: 6,
nome: "Pamonha de Milho Verde com Canela (Sazonal)",
preco: 12.60,
unidades: ["campina"],
desc: "Especial das festas juninas de São João. Feita com milho fresco debulhado na hora." 
},

{
id: 7,
nome: "Suco Natural de Umbu (Copo 400ml)",
preco: 8.50,
unidades: ["recife", "salvador", "campina"],
desc: "Polpa fresca da fruta típica do sertão nordestino, rica em sabor e refrescância."
},

{
id: 8,
nome: "Café Coado na Hora com Manteiga de Garrafa",
preco: 6.00,
unidades: ["recife", "salvador", "campina"],
desc: "Café passado em coador de pano tradicional, perfeito para acompanhar o cuscuz."
}
];

let carrinho = [];
let total = 0.0;
let pontosAcumulados = 0;

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
renderCardapio();
document.getElementById("select-unidade").addEventListener("change", () => {
carrinho = [];
atualizarCarrinho();
renderCardapio();
});

document.getElementById("btn-aceitar-lgpd").addEventListener("click", () => {
document.getElementById("lgpd-banner").style.display = "none";
});
});

// renderizar cardápio conforme unidade

function renderCardapio() {
const unidade = document.getElementById("select-unidade").value;
const grid = document.getElementById("grid-produtos");
grid.innerHTML = "";
const produtosFiltrados = produtosBase.filter(p => p.unidades.includes(unidade));

produtosFiltrados.forEach(prod => {
const card = document.createElement("div");
card.className = "card-item";
card.innerHTML = `
<div>
<h3>${prod.nome}</h3>
<p>${prod.desc}</p>
</div>
<div>
<span class="preco">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
<button class="btn-add" onclick="adicionarAoCarrinho(${prod.id})">Adicionar</button>
</div>
    `;
grid.appendChild(card);
});
}

// funcao pra add item no carrinho

function adicionarAoCarrinho(id) {
const item = produtosBase.find(p => p.id === id);
carrinho.push(item);
atualizarCarrinho();
}

// funcao pra atualizar interface carrinho
function atualizarCarrinho() {
const lista = document.getElementById("lista-carrinho");
lista.innerHTML = "";

if (carrinho.length === 0) {
lista.innerHTML = '<li class="carrinho-vazio">Carrinho vazio</li>';
total = 0.0;
} else {
total = 0.0;
carrinho.forEach((item, index) => {
total += item.preco;
const li = document.createElement("li");
li.innerHTML = `
<span>${item.nome}</span>
<div>
<span>R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
<button class="btn-remover" onclick="removerDoCarrinho(${index})" title="Remover item">×</button>
</div>
 `;
lista.appendChild(li);
});
}
document.getElementById("total-carrinho").innerText = total.toFixed(2).replace('.', ',');
}

// funcao remover item carrinho

function removerDoCarrinho(index) {
carrinho.splice(index, 1); // remove o exato item clicado da lista
atualizarCarrinho(); // recalcula o total
}

// simulacao de fluxo de pagamento desacoplado (integracao externa)

function processarPagamento() {
const nome = document.getElementById("cliente-nome").value.trim();
const telefone = document.getElementById("cliente-telefone").value.trim();
const cpf = document.getElementById("cliente-cpf").value.trim();
const formaPagamento = document.querySelector('input[name="pagamento"]:checked').value;
const consentimento = document.getElementById("check-fidelidade").checked;
const statusBox = document.getElementById("status-box");
const statusTexto = document.getElementById("status-texto");
const statusDetalhe = document.getElementById("status-detalhe");

// validação pro carrinho não poder ficar vazio

if (carrinho.length === 0) {
alert("Adicione ao menos um item ao carrinho!");
return;
}

// validação nome obrigatório

if (!nome) {
alert("Por favor, preencha o seu nome para identificação do pedido.");
return;
}

// validação de telefone que deve conter DDD + número (10 ou 11 dígitos)

const telLimpo = telefone.replace(/\D/g, '');
if (telLimpo.length < 10 || telLimpo.length > 11) {
alert("Por favor, informe um telefone válido com DDD (ex: 81901234567).");
return;
}

// validação Fidelidade LGPD exige CPF com exatamente 11 digitos

if (consentimento) {
const cpfLimpo = cpf.replace(/\D/g, '');
if (cpfLimpo.length !== 11) {
alert("Para acumular pontos de fidelidade, digite um CPF válido com 11 dígitos.");
return;
}
}

// box de feedback após clicar em Ir para Pagamento

statusBox.className = "status-box";
statusBox.style.backgroundColor = "#fff3cd";
statusBox.style.borderColor = "#ffeeba";
statusTexto.innerText = `Conectando ao gateway parceiro para pagamento via ${formaPagamento}...`;
statusDetalhe.innerHTML = "<small>Enviando requisição com segurança...</small>";

// simula resposta assíncrona do serviço externo de pagamento
setTimeout(() => {
statusBox.style.backgroundColor = "#eef6ec";
statusBox.style.borderColor = "#73b36a";
statusTexto.innerText = `Pagamento via ${formaPagamento} APROVADO!`;
    
// calcula fidelidade se houve consentimento e CPF preenchido

let msgFidelidade = "";
if (consentimento && cpf) {
const pontosGanhos = Math.floor(total);
pontosAcumulados += pontosGanhos;
document.getElementById("pontos-fidelidade").innerText = `Seus Pontos: ${pontosAcumulados} pts`;
msgFidelidade = `<p><strong>Fidelidade LGPD:</strong> Pontos creditados para o CPF ${cpf} (+${pontosGanhos} pts).</p>`;
} else {
msgFidelidade = "<p><small>Pontos não acumulados nesta operação.</small></p>";
}

statusDetalhe.innerHTML = `
<p>Pedido enviado para a equipe da cozinha!</p>
<p>Cliente: <strong>${nome}</strong> (${telefone})</p>
<p>Transação nº: #RN-${Math.floor(Math.random() * 900000 + 100000)}</p>
${msgFidelidade}
  `;

// limpar carrinho
carrinho = [];
atualizarCarrinho();
}, 2000);
}