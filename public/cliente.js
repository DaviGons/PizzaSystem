const API_URL = 'http://localhost:3000/api';

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
    carregarCardapio();
});

// --- NAVEGAÇÃO ---
function verificarSessao() {
    const clienteId = localStorage.getItem('pizza_cliente_id');
    const clienteNome = localStorage.getItem('pizza_cliente_nome');
    
    if (clienteId && clienteNome) {
        mostrarTela('tela-pedido');
        document.getElementById('nome-cliente-display').innerText = `Olá, ${clienteNome}`;
        carregarHistorico();
    } else {
        mostrarTela('tela-cadastro');
    }
}

function mostrarTela(telaId) {
    document.querySelectorAll('section').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('ativo');
    });
    const tela = document.getElementById(telaId);
    tela.classList.remove('hidden');
    tela.classList.add('ativo');
}

document.getElementById('btn-sair').addEventListener('click', () => {
    if(confirm("Deseja sair?")) {
        localStorage.removeItem('pizza_cliente_id');
        localStorage.removeItem('pizza_cliente_nome');
        window.location.reload();
    }
});

// --- CADASTRO ---
document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cpf: document.getElementById('cpf').value
    };

    try {
        const res = await fetch(`${API_URL}/clientes`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            // Simulação de login imediato após cadastro
            localStorage.setItem('pizza_cliente_id', '999'); // Num sistema real, o backend devolveria o ID
            localStorage.setItem('pizza_cliente_nome', dados.nome);
            verificarSessao();
        } else {
            exibirMensagem('Erro ao cadastrar.', 'erro');
        }
    } catch (error) {
        exibirMensagem('Sem conexão com o servidor.', 'erro');
    }
});

// --- PEDIDO ---
async function carregarCardapio() {
    try {
        const [resPizzas, resOutros] = await Promise.all([
            fetch(`${API_URL}/pizzas`),
            fetch(`${API_URL}/outros`)
        ]);
        
        renderizarSelect(await resPizzas.json(), 'select-pizza', 'pizzas');
        renderizarSelect(await resOutros.json(), 'select-extra', 'outros');

    } catch (error) { console.error("Erro ao carregar cardápio"); }
}

function renderizarSelect(items, elementId, tipo) {
    const select = document.getElementById(elementId);
    select.innerHTML = '<option value="">Selecione...</option>';
    items.forEach(item => {
        const label = tipo === 'pizzas' ? item.sabor : item.nome;
        select.innerHTML += `<option value="${item.id}" data-preco="${item.preco}">${label} - R$ ${item.preco}</option>`;
    });
}

// Cálculos e UX
document.getElementById('check-extra').addEventListener('change', (e) => {
    const area = document.getElementById('area-extra');
    if(e.target.checked) area.classList.remove('hidden');
    else area.classList.add('hidden');
    calcularTotal();
});

['select-pizza', 'qtd-pizza', 'select-extra', 'qtd-extra', 'check-extra'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('change', calcularTotal);
    if(el) el.addEventListener('input', calcularTotal);
});

function calcularTotal() {
    let total = 0;
    
    // Pizza
    const selPizza = document.getElementById('select-pizza');
    const qtdPizza = document.getElementById('qtd-pizza').value;
    const optPizza = selPizza.options[selPizza.selectedIndex];
    if (optPizza && optPizza.dataset.preco) total += parseFloat(optPizza.dataset.preco) * qtdPizza;

    // Extra
    if (document.getElementById('check-extra').checked) {
        const selExtra = document.getElementById('select-extra');
        const qtdExtra = document.getElementById('qtd-extra').value;
        const optExtra = selExtra.options[selExtra.selectedIndex];
        if (optExtra && optExtra.dataset.preco) total += parseFloat(optExtra.dataset.preco) * qtdExtra;
    }

    document.getElementById('valor-total').innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return total;
}

// Enviar Pedido
document.getElementById('form-pedido').addEventListener('submit', async (e) => {
    e.preventDefault();
    const total = calcularTotal();
    if (total <= 0) return exibirMensagem('Selecione uma pizza!', 'erro');

    const pedido = {
        clienteId: localStorage.getItem('pizza_cliente_id') || 1,
        pizzaId: document.getElementById('select-pizza').value,
        qtdPizza: document.getElementById('qtd-pizza').value,
        valorTotal: total,
        formaPagamento: document.getElementById('pagamento').value,
        status: 'Recebido',
        itemExtra: document.getElementById('check-extra').checked ? {
            id: document.getElementById('select-extra').value,
            qtd: document.getElementById('qtd-extra').value,
            nome: document.getElementById('select-extra').options[document.getElementById('select-extra').selectedIndex].text
        } : null
    };

    try {
        const res = await fetch(`${API_URL}/pedidos`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(pedido)
        });
        if(res.ok) {
            exibirMensagem('Pedido enviado! Acompanhe abaixo.', 'sucesso');
            carregarHistorico();
        }
    } catch (e) { exibirMensagem('Erro ao enviar.', 'erro'); }
});

async function carregarHistorico() {
    try {
        const res = await fetch(`${API_URL}/pedidos`);
        const todos = await res.json();
        // Filtro simples no front (ideal seria filtrar no back)
        const meus = todos.filter(p => p.clienteId == localStorage.getItem('pizza_cliente_id'));
        
        const ul = document.getElementById('lista-pedidos');
        ul.innerHTML = '';
        meus.reverse().forEach(p => {
            ul.innerHTML += `<li><strong>#${p.id}</strong> - <span style="color:${getCorStatus(p.status)}">${p.status}</span> - R$ ${parseFloat(p.valorTotal).toFixed(2)}</li>`;
        });
    } catch (e) {}
}

function getCorStatus(status) {
    if(status === 'Recebido') return '#f39c12';
    if(status === 'Concluído') return '#27ae60';
    if(status === 'Cancelado') return '#c0392b';
    return '#333';
}

function exibirMensagem(msg, tipo) {
    const div = document.getElementById('msg-area');
    div.textContent = msg;
    div.className = `mensagem ${tipo}`;
    div.classList.remove('hidden');
    setTimeout(() => div.classList.add('hidden'), 3000);
}