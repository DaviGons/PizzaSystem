const API_URL = 'http://localhost:3000/api';

// --- TESTE DE CARREGAMENTO ---
console.log("Admin Script Carregado com Sucesso!");

// --- CONTROLE DE LOGIN (Modificado para não travar) ---
document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault(); // Impede recarregar a página
    
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    if (user === 'admin' && pass === 'admin') {
        console.log("Login Autorizado.");
        
        // ESCONDE LOGIN (Força bruta para garantir)
        const telaLogin = document.getElementById('tela-login');
        telaLogin.classList.add('hidden');
        telaLogin.style.display = 'none'; 

        // MOSTRA DASHBOARD
        const dashboard = document.getElementById('dashboard');
        dashboard.classList.remove('hidden');
        dashboard.style.display = 'block';

        iniciarDashboard();
    } else {
        const errorMsg = document.getElementById('login-error');
        errorMsg.classList.remove('hidden');
        errorMsg.style.display = 'block';
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    if(confirm("Deseja realmente sair?")) window.location.reload();
});

// --- NAVEGAÇÃO ENTRE ABAS ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // 1. Tira ativo de todos
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none'; // Garante que sumiu
        });
        
        // 2. Ativa o clicado
        btn.classList.add('active');
        const targetId = btn.dataset.target;
        const targetSection = document.getElementById(targetId);
        
        if(targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block'; // Garante que apareceu
        }
    });
});

function iniciarDashboard() {
    carregarPedidos();
    carregarProdutos();
    carregarClientes();
}

// --- 1. PEDIDOS ---
async function carregarPedidos() {
    const tbody = document.querySelector('#tabela-pedidos tbody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Carregando pedidos...</td></tr>';

    try {
        const res = await fetch(`${API_URL}/pedidos`);
        const pedidos = await res.json();
        tbody.innerHTML = '';

        if (pedidos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Nenhum pedido na fila.</td></tr>';
            return;
        }

        pedidos.forEach(p => {
            let desc = `<strong>Pizza ID ${p.pizzaId}</strong> (x${p.qtdPizza})`;
            if (p.itemExtra) desc += `<br><small>+ ${p.itemExtra.nome} (x${p.itemExtra.qtd})</small>`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${p.id}</td>
                <td>ID: ${p.clienteId}</td>
                <td>${desc}</td>
                <td>R$ ${parseFloat(p.valorTotal).toFixed(2)}</td>
                <td>
                    <select class="status-select" onchange="atualizarStatus('${p.id}', this.value)" style="padding:5px; border-radius:4px;">
                        <option value="Recebido" ${p.status === 'Recebido' ? 'selected' : ''}>Recebido</option>
                        <option value="Em Preparo" ${p.status === 'Em Preparo' ? 'selected' : ''}>Em Preparo</option>
                        <option value="Saiu para Entrega" ${p.status === 'Saiu para Entrega' ? 'selected' : ''}>Saiu para Entrega</option>
                        <option value="Concluído" ${p.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                        <option value="Cancelado" ${p.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </td>
                <td>
                     <button class="btn-small btn-sair" onclick="deletarItem('pedidos', '${p.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) { 
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="6" style="color:red; text-align:center">Erro ao conectar com o servidor.</td></tr>'; 
    }
}

document.getElementById('btn-refresh-pedidos').addEventListener('click', carregarPedidos);

// Atualiza o status REAL no servidor
window.atualizarStatus = async (id, novoStatus) => {
    try {
        const res = await fetch(`${API_URL}/pedidos/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status: novoStatus })
        });
        
        if(res.ok) {
            exibirMensagem(`Pedido #${id} atualizado para: ${novoStatus}`, 'sucesso');
        } else {
            exibirMensagem('Erro ao atualizar status.', 'erro');
        }
    } catch (error) {
        console.error(error);
        exibirMensagem('Erro de conexão.', 'erro');
    }
};

// --- 2. CARDÁPIO ---
async function carregarProdutos() {
    const tbody = document.querySelector('#tabela-produtos tbody');
    
    try {
        const [resPizza, resOutros] = await Promise.all([
            fetch(`${API_URL}/pizzas`),
            fetch(`${API_URL}/outros`)
        ]);
        const pizzas = await resPizza.json();
        const outros = await resOutros.json();
        
        tbody.innerHTML = '';
        pizzas.forEach(p => {
            tbody.innerHTML += `<tr><td>🍕 Pizza</td><td>${p.sabor}</td><td>R$ ${p.preco}</td><td><button class="btn-small btn-sair" onclick="deletarItem('pizzas', '${p.id}')">X</button></td></tr>`;
        });
        outros.forEach(o => {
            tbody.innerHTML += `<tr><td>🥤 Extra</td><td>${o.nome}</td><td>R$ ${o.preco}</td><td><button class="btn-small btn-sair" onclick="deletarItem('outros', '${o.id}')">X</button></td></tr>`;
        });
    } catch (error) { console.error(error); }
}

// Adicionar Pizza
document.getElementById('form-add-pizza').addEventListener('submit', async (e) => {
    e.preventDefault();
    await enviarDados('/pizzas', {
        sabor: document.getElementById('pizza-sabor').value,
        ingredientes: document.getElementById('pizza-ingredientes').value,
        preco: parseFloat(document.getElementById('pizza-preco').value)
    }, 'Pizza Salva!', carregarProdutos);
    e.target.reset();
});

// Adicionar Extra
document.getElementById('form-add-outro').addEventListener('submit', async (e) => {
    e.preventDefault();
    await enviarDados('/outros', {
        nome: document.getElementById('outro-nome').value,
        preco: parseFloat(document.getElementById('outro-preco').value)
    }, 'Extra Salvo!', carregarProdutos);
    e.target.reset();
});

// --- 3. CLIENTES ---
async function carregarClientes() {
    const tbody = document.querySelector('#tabela-clientes tbody');
    try {
        const res = await fetch(`${API_URL}/clientes`);
        const clientes = await res.json();
        tbody.innerHTML = '';
        clientes.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nome}</td>
                    <td>${c.telefone}</td>
                    <td>${c.endereco}</td>
                    <td><button class="btn-small btn-sair" onclick="deletarItem('clientes', '${c.id}')">X</button></td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

document.getElementById('form-add-cliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    await enviarDados('/clientes', {
        nome: document.getElementById('cli-nome').value,
        telefone: document.getElementById('cli-telefone').value,
        endereco: document.getElementById('cli-endereco').value,
        cpf: document.getElementById('cli-cpf').value
    }, 'Cliente Cadastrado!', carregarClientes);
    e.target.reset();
});

// --- FUNÇÕES AUXILIARES ---

async function enviarDados(endpoint, dados, msgSucesso, callback) {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        });
        if(res.ok) {
            exibirMensagem(msgSucesso, 'sucesso');
            if(callback) callback();
        } else {
            exibirMensagem('Erro ao salvar dados.', 'erro');
        }
    } catch(e) { exibirMensagem('Erro de conexão.', 'erro'); }
}

window.deletarItem = async (tipo, id) => {
    if(!confirm('Tem certeza que deseja excluir este item permanentemente?')) return;
    
    try {
        const res = await fetch(`${API_URL}/${tipo}/${id}`, { method: 'DELETE' });
        if(res.ok) {
            exibirMensagem('Item excluído.', 'sucesso');
            if(tipo === 'pedidos') carregarPedidos();
            else if(tipo === 'clientes') carregarClientes();
            else carregarProdutos();
        } else {
            exibirMensagem('Erro ao excluir.', 'erro');
        }
    } catch(e) {
        console.error(e);
        exibirMensagem('Erro ao excluir.', 'erro');
    }
};

function exibirMensagem(msg, tipo) {
    const div = document.getElementById('msg-area');
    if(!div) return;
    div.textContent = msg;
    div.className = `mensagem ${tipo}`;
    div.style.display = 'block'; // Força aparecer
    setTimeout(() => div.style.display = 'none', 3000);
}