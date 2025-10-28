document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. SIMULAÇÃO DE BANCO DE DADOS (com LocalStorage)
    // ==================================================
    let db = {
        clientes: [],       // ID;Nome;Telefone;Endereco;CPF;Status (1=Ativo, 0=Banido)
        cardapio: [],       // ID;Sabor;Ingredientes;Preco;Status (1=Disponível, 0=Indisponível)
        outrosProdutos: [], // ID;Nome;Preco;Status (1=Disponível, 0=Indisponível)
        pedidos: []         // ID;IDCliente;IDPizza;Qtd;ValorTotal;DataHora;FormaPagamento|IDExtra;QtdExtra
    };

    // Função para carregar dados do LocalStorage
    function carregarDB() {
        const dbSalvo = localStorage.getItem('pizzaSystemDB');
        if (dbSalvo) {
            db = JSON.parse(dbSalvo);
        }
    }

    // Função para salvar dados no LocalStorage
    function salvarDB() {
        localStorage.setItem('pizzaSystemDB', JSON.stringify(db));
    }
    
    // Função para limpar todos os dados
    function limparDB() {
        if (confirm('TEM CERTEZA? \nIsso apagará PERMANENTEMENTE todos os clientes, produtos e pedidos salvos no seu navegador.')) {
            localStorage.removeItem('pizzaSystemDB');
            db = { clientes: [], cardapio: [], outrosProdutos: [], pedidos: [] };
            exibirMensagem('Todos os dados foram apagados.', 'success');
            showView('view-main-menu');
        }
    }


    // ==================================================
    // 2. FUNÇÕES AUXILIARES (Portadas do TS)
    // ==================================================

    /**
     * Gera o próximo ID sequencial para um array do banco de dados.
     * Converte a lógica de ler arquivos para ler arrays de objetos.
     * @param {Array} array - O array do DB (ex: db.clientes)
     * @param {number} padLength - O comprimento do ID (ex: 3 para '003')
     * @returns {string} O próximo ID formatado.
     */
    function gerarProximoId(array, padLength = 3) {
        if (array.length === 0) {
            return '1'.padStart(padLength, '0');
        }
        const ultimoItem = array[array.length - 1];
        const proximoIdNum = parseInt(ultimoItem.id, 10) + 1;
        return proximoIdNum.toString().padStart(padLength, '0');
    }
    
    /**
     * Funções para buscar itens no DB por ID.
     */
    const findClienteById = (id) => db.clientes.find(c => c.id === id);
    const findPizzaById = (id) => db.cardapio.find(p => p.id === id);
    const findOutroById = (id) => db.outrosProdutos.find(o => o.id === id);
    
    /**
     * Formata a data e hora atual.
     */
    function getDataHoraAtual() {
        const data = new Date();
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        const hora = data.getHours().toString().padStart(2, '0');
        const min = data.getMinutes().toString().padStart(2, '0');
        const seg = data.getSeconds().toString().padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;
    }

    // ==================================================
    // 3. CONTROLE DA INTERFACE (Navegação e Mensagens)
    // ==================================================
    const views = document.querySelectorAll('.view');
    const navButtons = document.querySelectorAll('.nav-btn');
    const messageArea = document.getElementById('message-area');
    let activeView = 'view-main-menu';

    /**
     * Exibe uma view específica e esconde as outras.
     * @param {string} viewId - O ID da div (view) a ser exibida.
     */
    function showView(viewId) {
        // Esconde a mensagem de feedback
        limparMensagem();
        
        // Esconde todas as views
        views.forEach(view => view.style.display = 'none');
        
        // Mostra a view solicitada
        const viewToShow = document.getElementById(viewId);
        if (viewToShow) {
            viewToShow.style.display = 'block';
            activeView = viewId;
        }
        
        // Atualiza o botão ativo no menu
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });

        // Funções de "refresh" de dados para views específicas
        // Isso garante que os dados estejam sempre atualizados ao entrar na view
        switch(viewId) {
            case 'view-gerar-pedido':
                popularSelectsPedido();
                recalcularTotalPedido();
                document.getElementById('pedido-comprovante-area').classList.add('hidden');
                document.getElementById('form-gerar-pedido').reset();
                break;
            case 'view-gerenciar-cardapio':
                popularTabelaPizzas();
                popularTabelaOutrosProdutos();
                break;
            case 'view-gerenciar-cadastros':
                popularTabelaClientes();
                document.getElementById('form-edit-cliente').classList.add('hidden');
                break;
            case 'view-relatorios':
                document.getElementById('output-relatorios').innerHTML = '<p>Selecione um tipo de relatório acima.</p>';
                break;
        }
    }

    // Adiciona listeners aos botões de navegação
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => showView(btn.dataset.view));
    });
    
    /**
     * Exibe uma mensagem de sucesso ou erro.
     * @param {string} texto - A mensagem.
     * @param {'success' | 'error'} tipo - O tipo da mensagem.
     */
    function exibirMensagem(texto, tipo = 'success') {
        messageArea.textContent = texto;
        messageArea.className = tipo; // 'success' ou 'error'
        window.scrollTo(0, 0); // Rola para o topo para ver a mensagem
    }

    function limparMensagem() {
        messageArea.textContent = '';
        messageArea.className = '';
    }

    // ==================================================
    // 4. LÓGICA DAS VIEWS
    // ==================================================

    // --- [View 1 & 6] Cadastro e Gerenciamento de Clientes ---
    
    const formAddCliente = document.getElementById('form-add-cliente');
    const formEditCliente = document.getElementById('form-edit-cliente');
    const tableClientesBody = document.getElementById('table-gerenciar-clientes').querySelector('tbody');
    const btnCancelarEdicaoCliente = document.getElementById('btn-cancelar-edicao-cliente');

    // (Form 1) Adicionar Cliente
    formAddCliente.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = gerarProximoId(db.clientes, 3);
        
        const novoCliente = {
            id: id,
            nome: document.getElementById('cliente-nome').value,
            telefone: document.getElementById('cliente-telefone').value,
            endereco: document.getElementById('cliente-endereco').value,
            cpf: document.getElementById('cliente-cpf').value,
            status: '1' // 1 = Ativo
        };
        
        db.clientes.push(novoCliente);
        salvarDB();
        
        exibirMensagem(`Cliente "${novoCliente.nome}" cadastrado com sucesso! ID: ${id}`, 'success');
        formAddCliente.reset();
    });

    // (View 6) Popular Tabela de Clientes
    function popularTabelaClientes() {
        tableClientesBody.innerHTML = '';
        if (db.clientes.length === 0) {
            tableClientesBody.innerHTML = '<tr><td colspan="5">Nenhum cliente cadastrado.</td></tr>';
            return;
        }
        
        db.clientes.forEach(cliente => {
            const statusTexto = cliente.status === '1' ? 'Ativo' : 'Banido';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.telefone}</td>
                <td>${statusTexto}</td>
                <td>
                    <button class="btn-pequeno btn-secundario btn-edit-cliente" data-id="${cliente.id}">Editar</button>
                    ${cliente.status === '1'
                        ? `<button class="btn-pequeno btn-aviso btn-ban-cliente" data-id="${cliente.id}">Banir</button>`
                        : `<button class="btn-pequeno btn-sucesso btn-unban-cliente" data-id="${cliente.id}">Reativar</button>`
                    }
                    <button class="btn-pequeno btn-aviso btn-delete-cliente" data-id="${cliente.id}">Deletar</button>
                </td>
            `;
            tableClientesBody.appendChild(tr);
        });
    }
    
    // (View 6) Ações da Tabela de Clientes (Editar, Banir, Deletar)
    tableClientesBody.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        const clienteIndex = db.clientes.findIndex(c => c.id === id);
        if (clienteIndex === -1) return;
        
        const cliente = db.clientes[clienteIndex];

        if (e.target.classList.contains('btn-delete-cliente')) {
            if (confirm(`Deseja realmente deletar o cliente "${cliente.nome}"?`)) {
                db.clientes.splice(clienteIndex, 1);
                exibirMensagem('Cliente deletado.', 'success');
            }
        }
        else if (e.target.classList.contains('btn-ban-cliente')) {
            db.clientes[clienteIndex].status = '0'; // Banido
            exibirMensagem(`Cliente "${cliente.nome}" foi banido.`, 'success');
        }
        else if (e.target.classList.contains('btn-unban-cliente')) {
            db.clientes[clienteIndex].status = '1'; // Ativo
            exibirMensagem(`Cliente "${cliente.nome}" foi reativado.`, 'success');
        }
        else if (e.target.classList.contains('btn-edit-cliente')) {
            // Preenche o formulário de edição e exibe
            document.getElementById('edit-cliente-id').value = cliente.id;
            document.getElementById('edit-cliente-nome').value = cliente.nome;
            document.getElementById('edit-cliente-telefone').value = cliente.telefone;
            document.getElementById('edit-cliente-endereco').value = cliente.endereco;
            document.getElementById('edit-cliente-cpf').value = cliente.cpf;
            formEditCliente.classList.remove('hidden');
            window.scrollTo(0, 0);
            return; // Não salva/repopula ainda
        }

        salvarDB();
        popularTabelaClientes();
    });

    // (Form 6) Salvar Edição do Cliente
    formEditCliente.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-cliente-id').value;
        const clienteIndex = db.clientes.findIndex(c => c.id === id);
        if (clienteIndex === -1) return;

        // Atualiza os dados
        db.clientes[clienteIndex].nome = document.getElementById('edit-cliente-nome').value;
        db.clientes[clienteIndex].telefone = document.getElementById('edit-cliente-telefone').value;
        db.clientes[clienteIndex].endereco = document.getElementById('edit-cliente-endereco').value;
        db.clientes[clienteIndex].cpf = document.getElementById('edit-cliente-cpf').value;
        
        salvarDB();
        exibirMensagem('Cliente atualizado com sucesso!', 'success');
        formEditCliente.classList.add('hidden');
        formEditCliente.reset();
        popularTabelaClientes();
    });

    // (Form 6) Cancelar Edição
    btnCancelarEdicaoCliente.addEventListener('click', () => {
        formEditCliente.classList.add('hidden');
        formEditCliente.reset();
        limparMensagem();
    });
    
    // --- [View 2 & 5] Cadastro e Gerenciamento de Produtos ---

    const formAddPizza = document.getElementById('form-add-pizza');
    const formAddOutro = document.getElementById('form-add-outro');
    const tablePizzasBody = document.getElementById('table-gerenciar-pizzas').querySelector('tbody');
    const tableOutrosBody = document.getElementById('table-gerenciar-outros').querySelector('tbody');

    // (Form 2) Adicionar Pizza
    formAddPizza.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = gerarProximoId(db.cardapio, 2);
        
        const novaPizza = {
            id: id,
            sabor: document.getElementById('pizza-sabor').value,
            ingredientes: document.getElementById('pizza-ingredientes').value,
            preco: parseFloat(document.getElementById('pizza-preco').value).toFixed(2),
            status: '1' // 1 = Disponível
        };
        
        db.cardapio.push(novaPizza);
        salvarDB();
        
        exibirMensagem(`Pizza "${novaPizza.sabor}" cadastrada com sucesso! ID: ${id}`, 'success');
        formAddPizza.reset();
    });

    // (Form 2) Adicionar Outro Produto
    formAddOutro.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = gerarProximoId(db.outrosProdutos, 2);
        
        const novoProduto = {
            id: id,
            nome: document.getElementById('outro-nome').value,
            preco: parseFloat(document.getElementById('outro-preco').value).toFixed(2),
            status: '1' // 1 = Disponível
        };
        
        db.outrosProdutos.push(novoProduto);
        salvarDB();
        
        exibirMensagem(`Produto "${novoProduto.nome}" cadastrado com sucesso! ID: ${id}`, 'success');
        formAddOutro.reset();
    });
    
    // (View 5) Popular Tabela de Pizzas
    function popularTabelaPizzas() {
        tablePizzasBody.innerHTML = '';
        if (db.cardapio.length === 0) {
            tablePizzasBody.innerHTML = '<tr><td colspan="5">Nenhuma pizza cadastrada.</td></tr>';
            return;
        }
        
        db.cardapio.forEach(pizza => {
            const statusTexto = pizza.status === '1' ? 'Disponível' : 'Indisponível';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pizza.id}</td>
                <td>${pizza.sabor}</td>
                <td>R$ ${pizza.preco}</td>
                <td>${statusTexto}</td>
                <td>
                    ${pizza.status === '1'
                        ? `<button class="btn-pequeno btn-aviso btn-set-indisponivel-pizza" data-id="${pizza.id}">Indisponível</button>`
                        : `<button class="btn-pequeno btn-sucesso btn-set-disponivel-pizza" data-id="${pizza.id}">Disponível</button>`
                    }
                    <button class="btn-pequeno btn-aviso btn-delete-pizza" data-id="${pizza.id}">Deletar</button>
                </td>
            `;
            tablePizzasBody.appendChild(tr);
        });
    }
    
    // (View 5) Popular Tabela de Outros Produtos
    function popularTabelaOutrosProdutos() {
        tableOutrosBody.innerHTML = '';
        if (db.outrosProdutos.length === 0) {
            tableOutrosBody.innerHTML = '<tr><td colspan="5">Nenhum outro produto cadastrado.</td></tr>';
            return;
        }
        
        db.outrosProdutos.forEach(produto => {
            const statusTexto = produto.status === '1' ? 'Disponível' : 'Indisponível';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${produto.preco}</td>
                <td>${statusTexto}</td>
                <td>
                    ${produto.status === '1'
                        ? `<button class="btn-pequeno btn-aviso btn-set-indisponivel-outro" data-id="${produto.id}">Indisponível</button>`
                        : `<button class="btn-pequeno btn-sucesso btn-set-disponivel-outro" data-id="${produto.id}">Disponível</button>`
                    }
                    <button class="btn-pequeno btn-aviso btn-delete-outro" data-id="${produto.id}">Deletar</button>
                </td>
            `;
            tableOutrosBody.appendChild(tr);
        });
    }
    
    // (View 5) Ações da Tabela de Pizzas
    tablePizzasBody.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        const index = db.cardapio.findIndex(p => p.id === id);
        if (index === -1) return;

        if (e.target.classList.contains('btn-delete-pizza')) {
            db.cardapio.splice(index, 1);
            exibirMensagem('Pizza deletada.', 'success');
        } else if (e.target.classList.contains('btn-set-indisponivel-pizza')) {
            db.cardapio[index].status = '0';
            exibirMensagem('Pizza definida como indisponível.', 'success');
        } else if (e.target.classList.contains('btn-set-disponivel-pizza')) {
            db.cardapio[index].status = '1';
            exibirMensagem('Pizza definida como disponível.', 'success');
        }
        salvarDB();
        popularTabelaPizzas();
    });

    // (View 5) Ações da Tabela de Outros Produtos
    tableOutrosBody.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        const index = db.outrosProdutos.findIndex(p => p.id === id);
        if (index === -1) return;

        if (e.target.classList.contains('btn-delete-outro')) {
            db.outrosProdutos.splice(index, 1);
            exibirMensagem('Produto deletado.', 'success');
        } else if (e.target.classList.contains('btn-set-indisponivel-outro')) {
            db.outrosProdutos[index].status = '0';
            exibirMensagem('Produto definido como indisponível.', 'success');
        } else if (e.target.classList.contains('btn-set-disponivel-outro')) {
            db.outrosProdutos[index].status = '1';
            exibirMensagem('Produto definido como disponível.', 'success');
        }
        salvarDB();
        popularTabelaOutrosProdutos();
    });
    
    
    // --- [View 3] Gerar Pedido ---
    
    const formGerarPedido = document.getElementById('form-gerar-pedido');
    const selectCliente = document.getElementById('pedido-cliente');
    const selectPizza = document.getElementById('pedido-pizza');
    const selectOutro = document.getElementById('pedido-outro');
    const checkAddOutro = document.getElementById('pedido-add-outro');
    const grupoOutro = document.getElementById('pedido-outro-grupo');
    const totalDisplay = document.getElementById('pedido-valor-total');
    const comprovanteArea = document.getElementById('pedido-comprovante-area');
    
    // (View 3) Popular os selects do formulário de pedido
    function popularSelectsPedido() {
        // Popula Clientes
        selectCliente.innerHTML = '<option value="">Selecione um cliente...</option>';
        db.clientes.filter(c => c.status === '1').forEach(c => { // Apenas ativos
            selectCliente.innerHTML += `<option value="${c.id}">[${c.id}] ${c.nome}</option>`;
        });
        
        // Popula Pizzas
        selectPizza.innerHTML = '<option value="">Selecione uma pizza...</option>';
        db.cardapio.filter(p => p.status === '1').forEach(p => { // Apenas disponíveis
            selectPizza.innerHTML += `<option value="${p.id}" data-preco="${p.preco}">[${p.id}] ${p.sabor} - R$ ${p.preco}</option>`;
        });
        
        // Popula Outros Produtos
        selectOutro.innerHTML = '<option value="">Selecione um item extra...</option>';
        db.outrosProdutos.filter(o => o.status === '1').forEach(o => { // Apenas disponíveis
            selectOutro.innerHTML += `<option value="${o.id}" data-preco="${o.preco}">[${o.id}] ${o.nome} - R$ ${o.preco}</option>`;
        });
    }
    
    // (View 3) Mostrar/Esconder grupo de item extra
    checkAddOutro.addEventListener('change', () => {
        grupoOutro.classList.toggle('hidden', !checkAddOutro.checked);
        recalcularTotalPedido();
    });

    // (View 3) Recalcular total ao mudar qualquer campo
    const camposRecalculo = [selectPizza, document.getElementById('pedido-qtd-pizza'), checkAddOutro, selectOutro, document.getElementById('pedido-qtd-outro')];
    camposRecalculo.forEach(campo => campo.addEventListener('change', recalcularTotalPedido));
    
    function recalcularTotalPedido() {
        let total = 0;
        
        // Calcula Pizza
        const pizzaOption = selectPizza.options[selectPizza.selectedIndex];
        if (pizzaOption && pizzaOption.value) {
            const precoPizza = parseFloat(pizzaOption.dataset.preco);
            const qtdPizza = parseInt(document.getElementById('pedido-qtd-pizza').value) || 1;
            total += precoPizza * qtdPizza;
        }
        
        // Calcula Outro Produto (se marcado)
        if (checkAddOutro.checked) {
            const outroOption = selectOutro.options[selectOutro.selectedIndex];
            if (outroOption && outroOption.value) {
                const precoOutro = parseFloat(outroOption.dataset.preco);
                const qtdOutro = parseInt(document.getElementById('pedido-qtd-outro').value) || 1;
                total += precoOutro * qtdOutro;
            }
        }
        
        totalDisplay.textContent = `Valor Total: R$ ${total.toFixed(2)}`;
    }

    // (View 3) Finalizar Pedido (Submit)
    formGerarPedido.addEventListener('submit', (e) => {
        e.preventDefault();
        comprovanteArea.classList.add('hidden');
        
        const clienteId = selectCliente.value;
        const pizzaId = selectPizza.value;
        
        const cliente = findClienteById(clienteId);
        const pizza = findPizzaById(pizzaId);
        
        // Validações
        if (!cliente) {
            exibirMensagem('Erro: Cliente não encontrado ou não selecionado.', 'error');
            return;
        }
        if (cliente.status === '0') { // Re-validação por segurança
            exibirMensagem('Erro: Este cliente está banido e não pode fazer pedidos.', 'error');
            return;
        }
        if (!pizza) {
            exibirMensagem('Erro: Pizza não encontrada ou não selecionada.', 'error');
            return;
        }
        
        const qtdPizza = parseInt(document.getElementById('pedido-qtd-pizza').value);
        const formaPagamento = document.getElementById('pedido-pagamento').value;
        const dataHora = getDataHoraAtual();
        const idPedido = gerarProximoId(db.pedidos, 4);
        
        let valorTotal = parseFloat(pizza.preco) * qtdPizza;
        let itemExtra = null;
        let comprovanteOutrosItens = []; // Para o comprovante HTML
        
        if (checkAddOutro.checked && selectOutro.value) {
            const outroId = selectOutro.value;
            const outroProd = findOutroById(outroId);
            if (outroProd) {
                const qtdOutro = parseInt(document.getElementById('pedido-qtd-outro').value);
                valorTotal += parseFloat(outroProd.preco) * qtdOutro;
                itemExtra = { id: outroId, qtd: qtdOutro };
                comprovanteOutrosItens.push({ nome: outroProd.nome, quantidade: qtdOutro });
            }
        }
        
        // Salva o novo pedido no "DB"
        const novoPedido = {
            id: idPedido,
            clienteId: clienteId,
            pizzaId: pizzaId,
            qtdPizza: qtdPizza,
            valorTotal: valorTotal.toFixed(2),
            dataHora: dataHora,
            formaPagamento: formaPagamento,
            itemExtra: itemExtra // null ou { id, qtd }
        };
        
        db.pedidos.push(novoPedido);
        salvarDB();
        
        exibirMensagem(`Pedido ${idPedido} gerado com sucesso!`, 'success');
        
        // Gera o Comprovante (adaptação da função `gerarComprovante`)
        gerarComprovanteHTML(
            cliente.nome,
            pizza.sabor,
            qtdPizza,
            valorTotal.toFixed(2),
            formaPagamento,
            dataHora,
            comprovanteOutrosItens
        );

        formGerarPedido.reset();
        recalcularTotalPedido();
    });
    
    // (View 3) Função para gerar o HTML do comprovante
    function gerarComprovanteHTML(clienteNome, saborPizza, quantidadePizza, valorTotal, formaPagamento, dataHora, outrosItens) {
        let outrosItensHTML = '';
        outrosItens.forEach(item => {
            outrosItensHTML += `<p><strong>Outro Item:</strong> ${item.nome} x ${item.quantidade}</p>`;
        });

        comprovanteArea.innerHTML = `
            <div class="comprovante">
                <h3>COMPROVANTE DE PEDIDO</h3>
                <p><strong>Cliente:</strong> ${clienteNome}</p>
                <p><strong>Pizza:</strong> ${saborPizza} x ${quantidadePizza}</p>
                ${outrosItensHTML}
                <p><strong>Forma de Pagamento:</strong> ${formaPagamento}</p>
                <p><strong>Valor Total:</strong> R$ ${valorTotal}</p>
                <p><strong>Data e Hora:</strong> ${dataHora}</p>
            </div>
        `;
        comprovanteArea.classList.remove('hidden');
    }
    
    
    // --- [View 4] Relatórios ---
    
    const btnRelatorioDiario = document.getElementById('btn-relatorio-diario');
    const btnRelatorioMensal = document.getElementById('btn-relatorio-mensal');
    const outputRelatorios = document.getElementById('output-relatorios');
    
    btnRelatorioDiario.addEventListener('click', () => {
        const data = new Date();
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        const dataAtual = `${dia}/${mes}/${ano}`;

        const pedidosDoDia = db.pedidos.filter(p => p.dataHora.startsWith(dataAtual));
        gerarRelatorioHTML(pedidosDoDia, `Relatório do Dia (${dataAtual})`);
    });
    
    btnRelatorioMensal.addEventListener('click', () => {
        const data = new Date();
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        const mesAtual = `${mes}/${ano}`;

        const pedidosDoMes = db.pedidos.filter(p => p.dataHora.split(' ')[0].endsWith(mesAtual));
        gerarRelatorioHTML(pedidosDoMes, `Relatório do Mês (${mesAtual})`);
    });
    
    function gerarRelatorioHTML(pedidosFiltrados, titulo) {
        let html = `<h3>${titulo}</h3>`;
        let totalVendas = 0;
        
        if (pedidosFiltrados.length === 0) {
            html += '<p>Nenhum pedido encontrado para este período.</p>';
            outputRelatorios.innerHTML = html;
            return;
        }
        
        html += '<table><thead><tr><th>ID Pedido</th><th>Cliente</th><th>Itens</th><th>Valor</th><th>Pagamento</th><th>Data/Hora</th></tr></thead><tbody>';
        
        pedidosFiltrados.forEach(pedido => {
            const cliente = findClienteById(pedido.clienteId);
            const pizza = findPizzaById(pedido.pizzaId);
            
            let itensHTML = `Pizza: ${pizza ? pizza.sabor : 'N/A'} (x${pedido.qtdPizza})`;
            
            if (pedido.itemExtra) {
                const outro = findOutroById(pedido.itemExtra.id);
                itensHTML += `<br>Extra: ${outro ? outro.nome : 'N/A'} (x${pedido.itemExtra.qtd})`;
            }
            
            html += `
                <tr>
                    <td>${pedido.id}</td>
                    <td>${cliente ? cliente.nome : 'N/A'}</td>
                    <td>${itensHTML}</td>
                    <td>R$ ${pedido.valorTotal}</td>
                    <td>${pedido.formaPagamento}</td>
                    <td>${pedido.dataHora}</td>
                </tr>
            `;
            totalVendas += parseFloat(pedido.valorTotal);
        });
        
        html += '</tbody></table>';
        html += `<h3 style="text-align: right; margin-top: 15px;">Total de Vendas: R$ ${totalVendas.toFixed(2)}</h3>`;
        
        outputRelatorios.innerHTML = html;
    }

    // --- [View Main] Limpar Dados ---
    document.getElementById('btn-limpar-dados').addEventListener('click', limparDB);

    // ==================================================
    // 5. INICIALIZAÇÃO DO SISTEMA
    // ==================================================
    carregarDB();
    showView('view-main-menu'); // Exibe o menu principal ao carregar
    
});