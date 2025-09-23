import * as readlineSync from 'readline-sync';
import * as fs from "fs";

/**
 * @fileoverview Sistema de Gerenciamento de Pizzaria
 * Este script em TypeScript fornece um sistema de linha de comando para
 * gerenciar clientes, produtos, pedidos e relatórios de uma pizzaria.
 * Os dados são persistidos em arquivos de texto simples, com cada linha
 * representando um registro e os campos separados por ponto e vírgula.
 * * Estrutura dos Arquivos de Dados:
 * - cadastroCliente.txt: ID;Nome;Telefone;Endereco;CPF;Status (1=Ativo, 0=Banido)
 * - cardapio.txt: ID;Sabor;Ingredientes;Preco;Status (1=Disponível, 0=Indisponível)
 * - outrosProdutos.txt: ID;Nome;Preco;Status (1=Disponível, 0=Indisponível)
 * - pedidos.txt: ID;IDCliente;IDPizza;Quantidade;ValorTotal;DataHora;FormaPagamento|IDExtra;QuantidadeExtra
 */


/**
 * Limpa o console para uma interface de usuário mais limpa.
 */
const clearConsole = () => {
    process.stdout.write('\x1Bc');
};

/**
 * Lê e processa os dados de um arquivo de texto.
 * @param fileName O caminho para o arquivo.
 * @returns Um array de strings, onde cada string é uma linha do arquivo.
 */
const getLines = (fileName: string): string[] => {
    // Verifica se o arquivo existe antes de tentar lê-lo.
    if (!fs.existsSync(fileName)) {
        return [];
    }
    const data = fs.readFileSync(fileName, 'utf-8');
    // Remove o caractere de retorno de carro para compatibilidade entre sistemas operacionais.
    const cleanData = data.replace(/\r/g, '');
    // Divide os dados por linha, remove linhas vazias e retorna.
    return cleanData.trim().split('\n').filter(Boolean);
};

/**
 * Gera o próximo ID sequencial baseado no último ID de um arquivo.
 * @param fileName O caminho para o arquivo onde os IDs estão armazenados.
 * @param padLength O comprimento total do ID com preenchimento de zeros à esquerda.
 * @returns O próximo ID formatado como string.
 */
const gerarProximoId = (fileName: string, padLength: number = 3): string => {
    const linhas = getLines(fileName);
    if (linhas.length === 0) {
        // Se o arquivo estiver vazio, inicia a contagem com 1.
        return '1'.padStart(padLength, '0');
    }
    // Obtém o último ID da última linha e incrementa.
    const ultimoIdString = linhas[linhas.length - 1].split(';')[0];
    const proximoId = parseInt(ultimoIdString) + 1;
    // Formata o ID com preenchimento de zeros à esquerda.
    return proximoId.toString().padStart(padLength, '0');
};

/**
 * Exibe a lista de clientes cadastrados no console.
 * @param clientes Um array de strings, onde cada string representa um cliente.
 */
const exibirClientes = (clientes: string[]) => {
    console.log("=====================================================");
    console.log("             CLIENTES CADASTRADOS");
    console.log("=====================================================");
    clientes.forEach(cliente => {
        const [id, nome, telefone, endereco, cpf, status] = cliente.split(';');
        const statusTexto = status === '1' ? 'Ativo' : 'Banido';
        console.log(`[ID: ${id}] - ${nome} - Status: ${statusTexto}`);
    });
    console.log("=====================================================");
};

/**
 * Exibe o cardápio de pizzas disponíveis.
 * @param cardapio Um array de strings, onde cada string representa uma pizza.
 */
const exibirCardapio = (cardapio: string[]) => {
    console.log("=====================================================");
    console.log("             CARDÁPIO DISPONÍVEL");
    console.log("=====================================================");
    const pizzasDisponiveis = cardapio.filter(pizza => pizza.split(';')[4] === '1');
    pizzasDisponiveis.forEach(pizza => {
        const [id, sabor, ingredientes, preco] = pizza.split(';');
        console.log(`[ID: ${id}] - ${sabor} - R$ ${preco}`);
    });
    console.log("=====================================================");
};

/**
 * Exibe a lista de outros produtos (bebidas, etc.) disponíveis.
 * @param produtos Um array de strings, onde cada string representa um produto.
 */
const exibirOutrosProdutos = (produtos: string[]) => {
    console.log("\n=====================================================");
    console.log("             BEBIDAS E OUTROS");
    console.log("=====================================================");
    const produtosDisponiveis = produtos.filter(produto => produto.split(';')[3] === '1');
    produtosDisponiveis.forEach(produto => {
        const [id, nome, preco] = produto.split(';');
        console.log(`[ID: ${id}] - ${nome} - R$ ${preco}`);
    });
    console.log("=====================================================");
}

/**
 * Gera e exibe o comprovante de um pedido no console.
 * @param clienteNome O nome do cliente.
 * @param saborPizza O sabor da pizza pedida.
 * @param quantidadePizza A quantidade de pizzas.
 * @param valorTotal O valor total do pedido.
 * @param formaPagamento A forma de pagamento escolhida.
 * @param dataHora A data e hora do pedido.
 * @param outrosItens Um array de objetos com o nome e a quantidade de outros itens.
 */
const gerarComprovante = (
    clienteNome: string,
    saborPizza: string,
    quantidadePizza: number,
    valorTotal: string,
    formaPagamento: string,
    dataHora: string,
    outrosItens: { nome: string, quantidade: number }[]
) => {
    console.log("\n=====================================================");
    console.log("               COMPROVANTE DE PEDIDO");
    console.log("-----------------------------------------------------");
    console.log(`Cliente: ${clienteNome}`);
    console.log(`Pizza: ${saborPizza} x ${quantidadePizza}`);
    outrosItens.forEach(item => {
        console.log(`Outro Item: ${item.nome} x ${item.quantidade}`);
    });
    console.log(`Forma de Pagamento: ${formaPagamento}`);
    console.log(`Valor Total: R$ ${valorTotal}`);
    console.log(`Data e Hora: ${dataHora}`);
    console.log("=====================================================");
};

/**
 * Loop principal do sistema que exibe o menu e processa as opções do usuário.
 */
while (true) {
    clearConsole();
    // Exibição do menu principal
    console.log("=====================================================");
    console.log("SISTEMA DE PIZZARIA PIZZASYSTEM");
    console.log("SELECIONE OPÇÕES DE 1-7");
    console.log("[1] Cadastro de Cliente");
    console.log("[2] Cadastro de Produtos");
    console.log("[3] Gerar pedido");
    console.log("[4] Relatórios");
    console.log("[5] Gerenciar Cardápio");
    console.log("[6] Gerenciar Cadastros");
    console.log("[7] Fechar Sistema");
    console.log("=====================================================");
    let opmenu: string = readlineSync.question("Digite a Opção Desejada: ");

    switch (opmenu) {
        // Opção 1: Cadastro de Cliente
        case "1": {
            clearConsole();
            console.log("\n=====================================================");
            console.log("             CADASTRO DE CLIENTE");
            console.log("=======================================================");
            const fileName = "cadastroCliente.txt";
            const nome: string = readlineSync.question('Nome: ');
            const telefone: string = readlineSync.question('Telefone: ');
            const endereco: string = readlineSync.question('Endereco: ');
            const cpf: string = readlineSync.question('CPF: ');
            // Gera um novo ID e monta a linha de dados no formato de arquivo.
            const id = gerarProximoId(fileName, 3);
            const dadosCliente = `${id};${nome};${telefone};${endereco};${cpf};1\n`;
            // Adiciona a nova linha de dados ao arquivo.
            fs.appendFileSync(fileName, dadosCliente, 'utf-8');

            console.log("\nCliente cadastrado com sucesso!");
            console.log(`ID gerado: ${id}`);
            console.log("=====================================================\n");
            break;
        }

        // Opção 2: Cadastro de Produtos (sub-menu)
        case "2": {
            clearConsole();
            while (true) {
                console.log("\n=====================================================");
                console.log("             CADASTRO DE PRODUTOS");
                console.log("=======================================================");
                console.log("[1] Cadastro de Pizza");
                console.log("[2] Cadastro de Outros Produtos (Bebidas, etc.)");
                console.log("[0] Voltar ao menu principal");
                console.log("=======================================================");
                const subOpcaoProd = readlineSync.question("Digite a Opção Desejada: ");

                switch (subOpcaoProd) {
                    // Sub-opção 1: Cadastro de Pizza
                    case "1": {
                        clearConsole();
                        console.log("\n=====================================================");
                        console.log("             CADASTRO DE PIZZA");
                        console.log("=======================================================");
                        const fileName = "cardapio.txt"
                        const sabor: string = readlineSync.question('Sabor: ');
                        const ingredientes: string = readlineSync.question('Ingredientes: ');
                        const preco: number = readlineSync.questionFloat('Preço: ');
                        const id = gerarProximoId(fileName, 2);
                        // Formata os dados e adiciona ao arquivo de cardápio.
                        const dadosPizza = `${id};${sabor};${ingredientes};${preco.toFixed(2)};1\n`;
                        fs.appendFileSync(fileName, dadosPizza, 'utf-8');

                        console.log("\nSabor de Pizza Cadastrado com Sucesso!");
                        console.log(`ID gerado: ${id}`);
                        console.log("=====================================================\n");
                        break;
                    }
                    // Sub-opção 2: Cadastro de Outros Produtos
                    case "2": {
                        clearConsole();
                        console.log("\n=====================================================");
                        console.log("             CADASTRO DE OUTROS PRODUTOS");
                        console.log("=======================================================");
                        const fileName = "outrosProdutos.txt";
                        const nome: string = readlineSync.question('Nome do produto: ');
                        const preco: number = readlineSync.questionFloat('Preço: ');
                        const id = gerarProximoId(fileName, 2);
                        // Formata os dados e adiciona ao arquivo de outros produtos.
                        const dadosProduto = `${id};${nome};${preco.toFixed(2)};1\n`;
                        fs.appendFileSync(fileName, dadosProduto, 'utf-8');

                        console.log("\nProduto cadastrado com sucesso!");
                        console.log(`ID gerado: ${id}`);
                        break;
                    }
                    case "0": {
                        break; // Sai do sub-menu
                    }
                    default: {
                        console.log("\nOpção inválida.");
                        break;
                    }
                }

                if (subOpcaoProd === "0") {
                    break; // Sai do loop do sub-menu para o menu principal
                }
                readlineSync.question('Pressione Enter para continuar...');
            }
            break;
        }

        // Opção 3: Gerar Pedido
        case "3": {
            clearConsole();
            console.log("\n=====================================================");
            console.log("                 GERAR PEDIDO");
            console.log("=======================================================");
            const clientes = getLines("cadastroCliente.txt");
            const cardapio = getLines("cardapio.txt");
            const outrosProdutos = getLines("outrosProdutos.txt");

            // Exibe as listas para o usuário escolher.
            exibirClientes(clientes);
            exibirCardapio(cardapio);

            const clienteId = readlineSync.question('Digite o ID do cliente: ');
            const pizzaId = readlineSync.question('Digite o ID da pizza: ');
            const quantidade = readlineSync.questionInt('Digite a quantidade: ');
            // Busca o cliente e a pizza nos dados.
            const cliente = clientes.find(c => c.startsWith(`${clienteId};`));
            const pizza = cardapio.find(p => p.startsWith(`${pizzaId};`));

            // Realiza validações de cliente e produto.
            if (!cliente) {
                console.log("\nErro: Cliente não encontrado.");
            } else if (cliente.split(';')[5] === '0') {
                console.log("\nErro: Este cliente está banido e não pode fazer pedidos.");
            } else if (!pizza) {
                console.log("\nErro: Pizza não encontrada.");
            } else if (pizza.split(';')[4] === '0') {
                console.log("\nErro: A pizza selecionada está indisponível.");
            } else {
                let precoUnitario = parseFloat(pizza.split(';')[3]);
                let valorTotal = (precoUnitario * quantidade);
                let outrosItensPedido: { nome: string, quantidade: number }[] = [];
                let dadosOutrosItens = "";

                // Permite adicionar outros produtos ao pedido.
                const adicionarOutros = readlineSync.question("Deseja adicionar bebidas ou outros produtos? (S/N): ").toUpperCase();
                if (adicionarOutros === "S") {
                    exibirOutrosProdutos(outrosProdutos);
                    const produtoExtraId = readlineSync.question('Digite o ID do produto extra: ');
                    const produtoExtra = outrosProdutos.find(p => p.startsWith(`${produtoExtraId};`));
                    if (produtoExtra) {
                        const quantidadeExtra = readlineSync.questionInt('Digite a quantidade: ');
                        const precoExtra = parseFloat(produtoExtra.split(';')[2]);
                        valorTotal += (precoExtra * quantidadeExtra);
                        const nomeProdutoExtra = produtoExtra.split(';')[1];
                        outrosItensPedido.push({ nome: nomeProdutoExtra, quantidade: quantidadeExtra });
                        dadosOutrosItens = `|${produtoExtraId};${quantidadeExtra}`;
                    } else {
                        console.log("Produto extra não encontrado. Continuando sem ele.");
                    }
                }

                // Obtém a forma de pagamento.
                console.log("\nFormas de Pagamento:");
                console.log("[1] Pix");
                console.log("[2] Cartão (Débito/Crédito)");
                console.log("[3] Dinheiro");
                const formaPagamentoOpcao = readlineSync.question('Digite a forma de pagamento: ');
                let formaPagamento = '';
                switch (formaPagamentoOpcao) {
                    case '1': formaPagamento = 'Pix'; break;
                    case '2': formaPagamento = 'Cartão'; break;
                    case '3': formaPagamento = 'Dinheiro'; break;
                    default: formaPagamento = 'Não Informado'; break;
                }

                // Coleta data e hora para o registro do pedido.
                const data = new Date();
                const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
                const horaFormatada = `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}:${data.getSeconds().toString().padStart(2, '0')}`;
                const dataPedido = `${dataFormatada} ${horaFormatada}`;
                // Gera ID e salva o pedido no arquivo.
                const idPedido = gerarProximoId("pedidos.txt", 4);
                const dadosPedido = `${idPedido};${clienteId};${pizzaId};${quantidade};${valorTotal.toFixed(2)};${dataPedido};${formaPagamento}${dadosOutrosItens}\n`;
                fs.appendFileSync("pedidos.txt", dadosPedido, 'utf-8');

                console.log("\nPedido gerado com sucesso!");
                console.log(`ID do Pedido: ${idPedido}`);
                // Exibe o comprovante.
                const clienteDados = cliente.split(';');
                const pizzaDados = pizza.split(';');
                gerarComprovante(clienteDados[1], pizzaDados[1], quantidade, valorTotal.toFixed(2), formaPagamento, dataPedido, outrosItensPedido);
            }
            break;
        }

        // Opção 4: Relatórios (sub-menu)
        case "4": {
            clearConsole();
            while (true) {
                console.log("\n=====================================================");
                console.log("             MENU DE RELATÓRIOS");
                console.log("=====================================================");
                console.log("[1] Relatório Diário");
                console.log("[2] Relatório Mensal");
                console.log("[0] Voltar ao menu principal");
                console.log("=====================================================\n");
                const subOpcaoRelatorio = readlineSync.question("Digite a opção desejada: ");

                clearConsole();

                const pedidos = getLines("pedidos.txt");
                const clientes = getLines("cadastroCliente.txt");
                const cardapio = getLines("cardapio.txt");
                const outrosProdutos = getLines("outrosProdutos.txt");

                switch (subOpcaoRelatorio) {
                    // Sub-opção 1: Relatório Diário
                    case '1': {
                        console.log("\n=====================================================");
                        console.log("         RELATÓRIO DE PEDIDOS DO DIA");
                        console.log("=====================================================");

                        const data = new Date();
                        const dataAtual = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;

                        // Filtra os pedidos pela data atual.
                        const pedidosDoDia = pedidos.filter(pedido => {
                            const dadosPedido = pedido.split(';');
                            const dataPedido = dadosPedido[5].split(' ')[0];
                            return dataPedido === dataAtual;
                        });

                        let totalDiario = 0;
                        if (pedidosDoDia.length === 0) {
                            console.log("Nenhum pedido encontrado para a data de hoje.");
                        } else {
                            pedidosDoDia.forEach(pedido => {
                                const partesPedido = pedido.split('|');
                                const partesPizza = partesPedido[0].split(';');
                                const [idPedido, idCliente, idPizza, quantidadeString, valorTotalString, dataHora, formaPagamento] = partesPizza;

                                const cliente = clientes.find(c => c.startsWith(`${idCliente};`));
                                const pizza = cardapio.find(p => p.startsWith(`${idPizza};`));

                                console.log(`\n-----------------------------------------------------`);
                                console.log(`Pedido ID: ${idPedido}`);
                                console.log(`Cliente: ${cliente ? cliente.split(';')[1] : 'Não encontrado'} (ID: ${idCliente})`);
                                console.log(`Pizza: ${pizza ? pizza.split(';')[1] : 'Não encontrada'} (ID: ${idPizza}) - ${quantidadeString} unidade(s)`);

                                if (partesPedido.length > 1) {
                                    const [idExtra, quantidadeExtraString] = partesPedido[1].split(';');
                                    const produtoExtra = outrosProdutos.find(p => p.startsWith(`${idExtra};`));
                                    console.log(`Outros Produtos: ${produtoExtra ? produtoExtra.split(';')[1] : 'Não encontrado'} (ID: ${idExtra}) - ${quantidadeExtraString} unidade(s)`);
                                }
                                console.log(`Valor Total: R$ ${valorTotalString}`);
                                console.log(`Forma de Pagamento: ${formaPagamento}`);
                                console.log(`Data/Hora: ${dataHora}`);
                                totalDiario += parseFloat(valorTotalString);
                            });
                            console.log(`\n=====================================================`);
                            console.log(`Total de vendas do dia: R$ ${totalDiario.toFixed(2)}`);
                        }
                        console.log("=====================================================\n");
                        break;
                    }
                    // Sub-opção 2: Relatório Mensal
                    case '2': {
                        console.log("\n=====================================================");
                        console.log("         RELATÓRIO DE PEDIDOS DO MÊS");
                        console.log("=====================================================");

                        const data = new Date();
                        const mesAtual = (data.getMonth() + 1).toString().padStart(2, '0');

                        // Filtra os pedidos pelo mês atual.
                        const pedidosDoMes = pedidos.filter(pedido => {
                            const dadosPedido = pedido.split(';');
                            const dataPedido = dadosPedido[5].split(' ')[0];
                            return dataPedido.split('/')[1] === mesAtual;
                        });

                        let totalMensal = 0;
                        if (pedidosDoMes.length === 0) {
                            console.log("Nenhum pedido encontrado para o mês atual.");
                        } else {
                            pedidosDoMes.forEach(pedido => {
                                const partesPedido = pedido.split('|');
                                const partesPizza = partesPedido[0].split(';');
                                const [idPedido, idCliente, idPizza, quantidadeString, valorTotalString, dataHora, formaPagamento] = partesPizza;

                                const cliente = clientes.find(c => c.startsWith(`${idCliente};`));
                                const pizza = cardapio.find(p => p.startsWith(`${idPizza};`));

                                console.log(`\n-----------------------------------------------------`);
                                console.log(`Pedido ID: ${idPedido}`);
                                console.log(`Cliente: ${cliente ? cliente.split(';')[1] : 'Não encontrado'} (ID: ${idCliente})`);
                                console.log(`Pizza: ${pizza ? pizza.split(';')[1] : 'Não encontrada'} (ID: ${idPizza}) - ${quantidadeString} unidade(s)`);

                                if (partesPedido.length > 1) {
                                    const [idExtra, quantidadeExtraString] = partesPedido[1].split(';');
                                    const produtoExtra = outrosProdutos.find(p => p.startsWith(`${idExtra};`));
                                    console.log(`Outros Produtos: ${produtoExtra ? produtoExtra.split(';')[1] : 'Não encontrado'} (ID: ${idExtra}) - ${quantidadeExtraString} unidade(s)`);
                                }
                                console.log(`Valor Total: R$ ${valorTotalString}`);
                                console.log(`Forma de Pagamento: ${formaPagamento}`);
                                console.log(`Data/Hora: ${dataHora}`);
                                totalMensal += parseFloat(valorTotalString);
                            });
                            console.log(`\n=====================================================`);
                            console.log(`Total de vendas do mês: R$ ${totalMensal.toFixed(2)}`);
                        }
                        console.log("=====================================================\n");
                        break;
                    }
                    case '0': {
                        break; // Sai do sub-menu
                    }
                    default: {
                        console.log("\nOpção inválida.");
                        break;
                    }
                }

                if (subOpcaoRelatorio === '0') {
                    break; // Sai do loop do sub-menu para o menu principal
                }
                readlineSync.question('Pressione Enter para continuar...');
            }
            break;
        }

        // Opção 5: Gerenciar Cardápio (sub-menu)
        case "5": {
            clearConsole();
            while (true) {
                console.log("\n=====================================================");
                console.log("             GERENCIAR CARDÁPIO");
                console.log("=======================================================");
                console.log("[1] Gerenciar Pizzas");
                console.log("[2] Gerenciar Outros Produtos");
                console.log("[0] Voltar ao menu principal");
                console.log("=====================================================\n");
                const subOpcaoGerenciar = readlineSync.question('Digite a opção desejada: ');

                switch (subOpcaoGerenciar) {
                    // Sub-opção 1: Gerenciar Pizzas
                    case '1': {
                        const fileName = "cardapio.txt";
                        let cardapio = getLines(fileName);

                        console.log("\nCardápio Atual - Pizzas:");
                        // Exibe as pizzas com seus status.
                        cardapio.forEach(p => {
                            const [id, sabor, ingredientes, preco, status] = p.split(';');
                            const statusTexto = status === '1' ? 'DISPONÍVEL' : 'INDISPONÍVEL';
                            console.log(`[ID: ${id}] - ${sabor} - Preço: R$ ${preco} - Status: ${statusTexto}`);
                        });

                        console.log("\nOpções de Gerenciamento:");
                        console.log("[1] Deletar sabor");
                        console.log("[2] Tornar indisponível");
                        console.log("[3] Tornar disponível");
                        console.log("[0] Voltar");

                        const acao = readlineSync.question('Digite a opção desejada: ');
                        if (acao === '0') break;

                        const pizzaId = readlineSync.question('Digite o ID da pizza para gerenciar: ');
                        // Encontra o índice da pizza a ser gerenciada.
                        const pizzaIndex = cardapio.findIndex(p => p.startsWith(`${pizzaId};`));

                        if (pizzaIndex === -1) {
                            console.log("\nErro: Pizza não encontrada com o ID informado.");
                        } else {
                            let pizzaDados = cardapio[pizzaIndex].split(';');
                            switch (acao) {
                                case '1':
                                    // Remove o item do array.
                                    cardapio.splice(pizzaIndex, 1);
                                    console.log("\nPizza deletada com sucesso!");
                                    break;
                                case '2':
                                    // Altera o status para indisponível.
                                    pizzaDados[4] = '0';
                                    cardapio[pizzaIndex] = pizzaDados.join(';');
                                    console.log("\nPizza alterada para indisponível com sucesso!");
                                    break;
                                case '3':
                                    // Altera o status para disponível.
                                    pizzaDados[4] = '1';
                                    cardapio[pizzaIndex] = pizzaDados.join(';');
                                    console.log("\nPizza alterada para disponível com sucesso!");
                                    break;
                                default:
                                    console.log("\nOpção inválida.");
                                    break;
                            }
                            // Salva as alterações de volta no arquivo.
                            fs.writeFileSync(fileName, cardapio.join('\n') + '\n', 'utf-8');
                        }
                        break;
                    }
                    // Sub-opção 2: Gerenciar Outros Produtos (mesma lógica que o anterior)
                    case '2': {
                        const fileName = "outrosProdutos.txt";
                        let outrosProdutos = getLines(fileName);

                        console.log("\nOutros Produtos Atuais:");
                        outrosProdutos.forEach(p => {
                            const [id, nome, preco, status] = p.split(';');
                            const statusTexto = status === '1' ? 'DISPONÍVEL' : 'INDISPONÍVEL';
                            console.log(`[ID: ${id}] - ${nome} - Preço: R$ ${preco} - Status: ${statusTexto}`);
                        });

                        console.log("\nOpções de Gerenciamento:");
                        console.log("[1] Deletar produto");
                        console.log("[2] Tornar indisponível");
                        console.log("[3] Tornar disponível");
                        console.log("[0] Voltar");

                        const acao = readlineSync.question('Digite a opção desejada: ');
                        if (acao === '0') break;

                        const produtoId = readlineSync.question('Digite o ID do produto para gerenciar: ');
                        const produtoIndex = outrosProdutos.findIndex(p => p.startsWith(`${produtoId};`));

                        if (produtoIndex === -1) {
                            console.log("\nErro: Produto não encontrado com o ID informado.");
                        } else {
                            let produtoDados = outrosProdutos[produtoIndex].split(';');
                            switch (acao) {
                                case '1':
                                    outrosProdutos.splice(produtoIndex, 1);
                                    console.log("\nProduto deletado com sucesso!");
                                    break;
                                case '2':
                                    produtoDados[3] = '0';
                                    outrosProdutos[produtoIndex] = produtoDados.join(';');
                                    console.log("\nProduto alterado para indisponível com sucesso!");
                                    break;
                                case '3':
                                    produtoDados[3] = '1';
                                    outrosProdutos[produtoIndex] = produtoDados.join(';');
                                    console.log("\nProduto alterado para disponível com sucesso!");
                                    break;
                                default:
                                    console.log("\nOpção inválida.");
                                    break;
                            }
                            fs.writeFileSync(fileName, outrosProdutos.join('\n') + '\n', 'utf-8');
                        }
                        break;
                    }
                    case '0': {
                        break; // Sai do sub-menu
                    }
                    default: {
                        console.log("\nOpção inválida.");
                        break;
                    }
                }

                if (subOpcaoGerenciar === '0') break;
                readlineSync.question('\nPressione Enter para continuar...');
            }
            break;
        }

        // Opção 6: Gerenciar Cadastros de Clientes
        case "6": {
            clearConsole();
            console.log("\n=====================================================");
            console.log("             GERENCIAR CADASTROS");
            console.log("=======================================================");
            const fileName = "cadastroCliente.txt";
            let clientes = getLines(fileName);
            exibirClientes(clientes);

            console.log("\nOpções de Gerenciamento:");
            console.log("[1] Deletar cadastro");
            console.log("[2] Banir cadastro");
            console.log("[3] Editar informações");
            console.log("[0] Voltar ao menu principal");

            const subOpcao = readlineSync.question('Digite a opção desejada: ');
            if (subOpcao === '0') {
                break;
            }

            const clienteId = readlineSync.question('Digite o ID do cliente para gerenciar: ');
            const clienteIndex = clientes.findIndex(c => c.startsWith(`${clienteId};`));

            if (clienteIndex === -1) {
                console.log("\nErro: Cliente não encontrado com o ID informado.");
            } else {
                let clienteDados = clientes[clienteIndex].split(';');

                switch (subOpcao) {
                    case '1':
                        // Remove o cliente do array.
                        clientes.splice(clienteIndex, 1);
                        console.log("\nCadastro de cliente deletado com sucesso!");
                        break;
                    case '2':
                        // Altera o status do cliente para banido ('0').
                        clienteDados[5] = '0';
                        clientes[clienteIndex] = clienteDados.join(';');
                        console.log("\nCliente banido com sucesso!");
                        break;
                    case '3':
                        // Permite editar os campos do cliente individualmente.
                        console.log("\nDigite as novas informações para o cliente (deixe em branco para não alterar):");
                        const novoNome = readlineSync.question(`Novo Nome (${clienteDados[1]}): `) || clienteDados[1];
                        const novoTelefone = readlineSync.question(`Novo Telefone (${clienteDados[2]}): `) || clienteDados[2];
                        const novoEndereco = readlineSync.question(`Novo Endereco (${clienteDados[3]}): `) || clienteDados[3];
                        const novoCpf = readlineSync.question(`Novo CPF (${clienteDados[4]}): `) || clienteDados[4];

                        // Atualiza a linha do cliente com os novos dados.
                        clientes[clienteIndex] = `${clienteDados[0]};${novoNome};${novoTelefone};${novoEndereco};${novoCpf};${clienteDados[5]}`;
                        console.log("\nInformações do cliente editadas com sucesso!");
                        break;
                    default:
                        console.log("\nOpção inválida.");
                        break;
                }
                // Salva o array de volta no arquivo.
                fs.writeFileSync(fileName, clientes.join('\n') + '\n', 'utf-8');
            }
            break;
        }

        // Opção 7: Sair do sistema
        case "7": {
            break; // Sai do loop principal
        }

        // Opção padrão para entradas inválidas.
        default: {
            console.log("Opção inválida. Selecione uma opção de 1 a 7.");
        }
    }

    // Pede ao usuário para continuar, exceto na saída do sistema.
    if (opmenu !== "7") {
        readlineSync.question('\nPressione Enter para continuar...');
    } else {
        break;
    }
}