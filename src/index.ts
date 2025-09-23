// Importando os módulos necessários para o sistema
import * as readlineSync from 'readline-sync';
import * as fs from "fs";

// Função para limpar o console para uma melhor visualização do menu
const clearConsole = () => {
    process.stdout.write('\x1Bc');
};

// Função para ler o conteúdo de um arquivo de texto e separar por linhas
const getLines = (fileName: string): string[] => {
    // A gente checa se o arquivo existe para não dar erro
    if (!fs.existsSync(fileName)) {
        return [];
    }
    // Lê o arquivo e a gente usa 'utf-8' para os caracteres especiais
    const data = fs.readFileSync(fileName, 'utf-8');
    // Tira o '\r' que pode dar problema em alguns sistemas
    const cleanData = data.replace(/\r/g, '');
    // Divide o conteúdo em linhas e remove as linhas vazias
    return cleanData.trim().split('\n').filter(Boolean);
};

// Função para gerar um ID novo, que é o último ID do arquivo + 1
const gerarProximoId = (fileName: string, padLength: number = 3): string => {
    // A gente pega todas as linhas do arquivo primeiro
    const linhas = getLines(fileName);
    // Se o arquivo estiver vazio, a gente começa do 1
    if (linhas.length === 0) {
        return '1'.padStart(padLength, '0');
    }
    // Pega a última linha e pega só o ID dela (antes do ';')
    const ultimoIdString = linhas[linhas.length - 1].split(';')[0];
    // Converte para número, soma 1 e converte de volta para string
    const proximoId = parseInt(ultimoIdString) + 1;
    // Usa o padStart para o ID ter a quantidade de zeros que a gente quer
    return proximoId.toString().padStart(padLength, '0');
};

// Função para exibir a lista de clientes de forma organizada
const exibirClientes = (clientes: string[]) => {
    // Aqui a gente usa console.log para fazer uma tabela bonitinha no terminal
    console.log("=====================================================");
    console.log("             CLIENTES CADASTRADOS");
    console.log("=====================================================");
    // A gente percorre cada cliente na lista
    clientes.forEach(cliente => {
        // Separa a string do cliente em pedaços
        const [id, nome, telefone, endereco, cpf, status] = cliente.split(';');
        // Converte o '1' ou '0' do status para uma palavra
        const statusTexto = status === '1' ? 'Ativo' : 'Banido';
        // E imprime na tela
        console.log(`[ID: ${id}] - ${nome} - Status: ${statusTexto}`);
    });
    console.log("=====================================================");
};

// Função para mostrar só as pizzas que estão disponíveis no cardápio
const exibirCardapio = (cardapio: string[]) => {
    console.log("=====================================================");
    console.log("             CARDÁPIO DISPONÍVEL");
    console.log("=====================================================");
    // A gente filtra a lista para mostrar só as pizzas com status '1'
    const pizzasDisponiveis = cardapio.filter(pizza => pizza.split(';')[4] === '1');
    // Depois, a gente passa por cada uma e exibe
    pizzasDisponiveis.forEach(pizza => {
        const [id, sabor, ingredientes, preco] = pizza.split(';');
        console.log(`[ID: ${id}] - ${sabor} - R$ ${preco}`);
    });
    console.log("=====================================================");
};

// Função para mostrar os outros produtos que não são pizzas (bebidas, etc.)
const exibirOutrosProdutos = (produtos: string[]) => {
    console.log("\n=====================================================");
    console.log("             BEBIDAS E OUTROS");
    console.log("=====================================================");
    // Filtra para mostrar só os produtos disponíveis
    const produtosDisponiveis = produtos.filter(produto => produto.split(';')[3] === '1');
    // Exibe cada um
    produtosDisponiveis.forEach(produto => {
        const [id, nome, preco] = produto.split(';');
        console.log(`[ID: ${id}] - ${nome} - R$ ${preco}`);
    });
    console.log("=====================================================");
}

// Função para gerar e exibir o comprovante de pedido
const gerarComprovante = (
    clienteNome: string,
    saborPizza: string,
    quantidadePizza: number,
    outrosItens: {nome: string, quantidade: number, valor: string}[],
    valorTotal: string,
    formaPagamento: string,
    dataHora: string
) => {
    console.log("\n=====================================================");
    console.log("              COMPROVANTE DE PEDIDO");
    console.log("-----------------------------------------------------");
    console.log(`Cliente: ${clienteNome}`);
    console.log(`Pizza: ${saborPizza} x ${quantidadePizza}`);
    // A gente faz um loop para exibir cada item extra do pedido
    outrosItens.forEach(item => {
        console.log(`Outro Item: ${item.nome} x ${item.quantidade}`);
    });
    console.log(`Forma de Pagamento: ${formaPagamento}`);
    console.log(`Valor Total: R$ ${valorTotal}`);
    console.log(`Data e Hora: ${dataHora}`);
    console.log("=====================================================");
};

// Loop principal do sistema para manter o menu funcionando
while (true) {
    clearConsole();
    // Exibe o menu principal
    console.log("=====================================================");
    console.log("SISTEM DE PIZZARIA PIZZASYSTEM");
    console.log("SELECIONE OPÇÕES DE 1-9");
    console.log("[1] Cadastro de Cliente");
    console.log("[2] Cadastro de Produtos"); 
    console.log("[3] Gerar pedido");
    console.log("[4] Relatórios");
    console.log("[5] Gerenciar Cardápio");
    console.log("[6] Gerenciar Cadastros");
    console.log("[7] Fechar Sistema");
    console.log("=====================================================");
    // Pega a opção do usuário
    let opmenu: string = readlineSync.question("Digite a Opção Desejada:");

    // Usamos o switch (mais ogranizado que um monte de IF)
    switch (opmenu) {
        // Opção 1: Cadastro de Cliente
        case "1": {
            clearConsole();
            console.log("\n=====================================================");
            console.log("             CADASTRO DE CLIENTE");
            console.log("=======================================================");
            const fileName = "cadastroCliente.txt";
            const nome: string = readlineSync.question('Nome: ');
            const telefone: string = readlineSync.question('Telefone: ');
            const endereco: string = readlineSync.question('Endereco: ');
            const cpf: string = readlineSync.question('CPF: ');
            const id = gerarProximoId(fileName, 3);
            const dadosCliente = `${id};${nome};${telefone};${endereco};${cpf};1\n`;
            // Adiciona o novo cliente ao arquivo
            fs.appendFileSync(fileName, dadosCliente, 'utf-8');

            console.log("\nCliente cadastrado com sucesso!");
            console.log(`ID gerado: ${id}`);
            console.log("=====================================================\n");
            // Usamos um break aqui para sair do switch
            break;
        }

        // Opção 2: Cadastro de Produtos (agora com um submenu!)
        case "2": {
            clearConsole();
            // A gente criou um loop interno para o submenu
            while (true) {
                console.log("\n=====================================================");
                console.log("             CADASTRO DE PRODUTOS");
                console.log("=======================================================");
                console.log("[1] Cadastro de Pizza");
                console.log("[2] Cadastro de Outros Produtos (Bebidas, etc.)");
                console.log("[0] Voltar ao menu principal");
                console.log("=======================================================");
                const subOpcaoProd = readlineSync.question("Digite a Opção Desejada: ");

                switch (subOpcaoProd) {
                    case "1": {
                        clearConsole();
                        console.log("\n=====================================================");
                        console.log("             CADASTRO DE PIZZA");
                        console.log("=======================================================");
                        const fileName = "cardapio.txt"
                        const sabor: string = readlineSync.question('Sabor: ');
                        const ingredientes: string = readlineSync.question('Ingredientes: ');
                        const preco: number = readlineSync.questionFloat('Preço: ');
                        const id = gerarProximoId(fileName, 2);
                        const dadosPizza = `${id};${sabor};${ingredientes};${preco.toFixed(2)};1\n`;
                        fs.appendFileSync(fileName, dadosPizza, 'utf-8');

                        console.log("\nSabor de Pizza Cadastrado com Sucesso!");
                        console.log(`ID gerado: ${id}`);
                        console.log("=====================================================\n");
                        break;
                    }
                    case "2": {
                        clearConsole();
                        console.log("\n=====================================================");
                        console.log("             CADASTRO DE OUTROS PRODUTOS");
                        console.log("=======================================================");
                        const fileName = "outrosProdutos.txt";
                        const nome: string = readlineSync.question('Nome do produto: ');
                        const preco: number = readlineSync.questionFloat('Preço: ');
                        const id = gerarProximoId(fileName, 2);
                        const dadosProduto = `${id};${nome};${preco.toFixed(2)};1\n`;
                        fs.appendFileSync(fileName, dadosProduto, 'utf-8');
                    
                        console.log("\nProduto cadastrado com sucesso!");
                        console.log(`ID gerado: ${id}`);
                        console.log("=====================================================\n");
                        break;
                    }
                    case "0": {
                        // Se for 0, a gente sai do loop interno
                        break;
                    }
                    default: {
                        console.log("\nOpção inválida.");
                        break;
                    }
                }
                
                // Se a opção for 0, a gente sai do loop principal do menu também
                if (subOpcaoProd === "0") {
                    break;
                }
                readlineSync.question('Pressione Enter para continuar...');
            }
            break;
        }

        // Opção 3: Gerar Pedido
        case "3": {
            clearConsole();
            console.log("\n=====================================================");
            console.log("                 GERAR PEDIDO");
            console.log("=======================================================");
            const clientes = getLines("cadastroCliente.txt");
            const cardapio = getLines("cardapio.txt");
            const outrosProdutos = getLines("outrosProdutos.txt");

            exibirClientes(clientes);
            exibirCardapio(cardapio);
            
            const clienteId = readlineSync.question('Digite o ID do cliente: ');
            const pizzaId = readlineSync.question('Digite o ID da pizza: ');
            const quantidade = readlineSync.questionInt('Digite a quantidade: ');
            const cliente = clientes.find(c => c.startsWith(`${clienteId};`));
            const pizza = cardapio.find(p => p.startsWith(`${pizzaId};`));

            // Checamos se o cliente e a pizza existem e estão ativos
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
                let outrosItensPedido: {nome: string, quantidade: number, valor: string}[] = [];
                let dadosOutrosItens = "";

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
                        outrosItensPedido.push({nome: nomeProdutoExtra, quantidade: quantidadeExtra, valor: (precoExtra * quantidadeExtra).toFixed(2)});
                        dadosOutrosItens = `|${produtoExtraId};${quantidadeExtra}`;
                    } else {
                        console.log("Produto extra não encontrado. Continuando sem ele.");
                    }
                }

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

                const data = new Date();
                const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
                const horaFormatada = `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}:${data.getSeconds().toString().padStart(2, '0')}`;
                const dataPedido = `${dataFormatada} ${horaFormatada}`;
                const idPedido = gerarProximoId("pedidos.txt", 4);
                const dadosPedido = `${idPedido};${clienteId};${pizzaId};${quantidade};${valorTotal.toFixed(2)};${dataPedido};${formaPagamento}${dadosOutrosItens}\n`;
                fs.appendFileSync("pedidos.txt", dadosPedido, 'utf-8');

                console.log("\nPedido gerado com sucesso!");
                console.log(`ID do Pedido: ${idPedido}`);
                const clienteDados = cliente.split(';');
                const pizzaDados = pizza.split(';');
                gerarComprovante(clienteDados[1], pizzaDados[1], quantidade, outrosItensPedido, valorTotal.toFixed(2), formaPagamento, dataPedido);
            }
            break;
        }
        
        // Opção 4: Relatórios
        case "4": {
            clearConsole();
            while (true) {
                console.log("\n=====================================================");
                console.log("             MENU DE RELATÓRIOS");
                console.log("=====================================================");
                console.log("[1] Relatório Diário");
                console.log("[2] Relatório Mensal");
                console.log("[0] Voltar ao menu principal");
                console.log("=====================================================\n");
                const subOpcaoRelatorio = readlineSync.question("Digite a opção desejada: ");

                clearConsole();

                switch (subOpcaoRelatorio) {
                    case '1': {
                        console.log("\n=====================================================");
                        console.log("         RELATÓRIO DE PEDIDOS DO DIA");
                        console.log("=====================================================");
                        
                        const pedidos = getLines("pedidos.txt");
                        const clientes = getLines("cadastroCliente.txt");
                        const cardapio = getLines("cardapio.txt");
                        const outrosProdutos = getLines("outrosProdutos.txt");
                        
                        const data = new Date();
                        const dataAtual = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
                        
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
                                // A gente separa a linha com o pipe '|' primeiro para não dar erro
                                const partesPedido = pedido.split('|');
                                const partesPizza = partesPedido[0].split(';');
                                const [idPedido, idCliente, idPizza, quantidade, valorTotal, data, formaPagamento] = partesPizza;
                                
                                const cliente = clientes.find(c => c.startsWith(`${idCliente};`));
                                const pizza = cardapio.find(p => p.startsWith(`${idPizza};`));
                                const nomeCliente = cliente ? cliente.split(';')[1] : 'Cliente não encontrado';
                                const saborPizza = pizza ? pizza.split(';')[1] : 'Pizza não encontrada';
                                
                                console.log(`\n-----------------------------------------------------`);
                                console.log(`Pedido ID: ${idPedido}`);
                                console.log(`Cliente: ${nomeCliente} (ID: ${idCliente})`);
                                console.log(`Pizza: ${saborPizza} (ID: ${idPizza}) - ${quantidade} unidade(s)`);

                                // Se tiver uma segunda parte, a gente mostra os outros produtos
                                if (partesPedido.length > 1) {
                                    const [idExtra, quantidadeExtra] = partesPedido[1].split(';');
                                    const produtoExtra = outrosProdutos.find(p => p.startsWith(`${idExtra};`));
                                    const nomeProdutoExtra = produtoExtra ? produtoExtra.split(';')[1] : 'Produto não encontrado';
                                    console.log(`Outros Produtos: ${nomeProdutoExtra} (ID: ${idExtra}) - ${quantidadeExtra} unidade(s)`);
                                }
                                console.log(`Valor Total: R$ ${valorTotal}`);
                                console.log(`Forma de Pagamento: ${formaPagamento}`);
                                console.log(`Data/Hora: ${data}`);
                                totalDiario += parseFloat(valorTotal);
                            });
                            console.log(`\n=====================================================`);
                            console.log(`Total de vendas do dia: R$ ${totalDiario.toFixed(2)}`);
                        }
                        console.log("=====================================================\n");
                        break;
                    }
                    case '2': {
                        console.log("\n=====================================================");
                        console.log("         RELATÓRIO DE PEDIDOS DO MÊS");
                        console.log("=====================================================");
                        
                        const pedidos = getLines("pedidos.txt");
                        const clientes = getLines("cadastroCliente.txt");
                        const cardapio = getLines("cardapio.txt");
                        const outrosProdutos = getLines("outrosProdutos.txt");

                        const data = new Date();
                        const mesAtual = (data.getMonth() + 1).toString().padStart(2, '0');
                        
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
                                // A gente faz a mesma correção aqui no relatório mensal
                                const partesPedido = pedido.split('|');
                                const partesPizza = partesPedido[0].split(';');
                                const [idPedido, idCliente, idPizza, quantidade, valorTotal, data, formaPagamento] = partesPizza;
                                
                                const cliente = clientes.find(c => c.startsWith(`${idCliente};`));
                                const pizza = cardapio.find(p => p.startsWith(`${idPizza};`));
                                const nomeCliente = cliente ? cliente.split(';')[1] : 'Cliente não encontrado';
                                const saborPizza = pizza ? pizza.split(';')[1] : 'Pizza não encontrada';
                                
                                console.log(`\n-----------------------------------------------------`);
                                console.log(`Pedido ID: ${idPedido}`);
                                console.log(`Cliente: ${nomeCliente} (ID: ${idCliente})`);
                                console.log(`Pizza: ${saborPizza} (ID: ${idPizza}) - ${quantidade} unidade(s)`);
                                
                                if (partesPedido.length > 1) {
                                    const [idExtra, quantidadeExtra] = partesPedido[1].split(';');
                                    const produtoExtra = outrosProdutos.find(p => p.startsWith(`${idExtra};`));
                                    const nomeProdutoExtra = produtoExtra ? produtoExtra.split(';')[1] : 'Produto não encontrado';
                                    console.log(`Outros Produtos: ${nomeProdutoExtra} (ID: ${idExtra}) - ${quantidadeExtra} unidade(s)`);
                                }
                                console.log(`Valor Total: R$ ${valorTotal}`);
                                console.log(`Forma de Pagamento: ${formaPagamento}`);
                                console.log(`Data/Hora: ${data}`);
                                totalMensal += parseFloat(valorTotal);
                            });
                            console.log(`\n=====================================================`);
                            console.log(`Total de vendas do mês: R$ ${totalMensal.toFixed(2)}`);
                        }
                        console.log("=====================================================\n");
                        break;
                    }
                    case '0': {
                        // Se for 0, a gente sai do loop interno de novo
                        break;
                    }
                    default: {
                        console.log("\nOpção inválida.");
                        break;
                    }
                }
                
                // Checa a opção para voltar ao menu principal
                if (subOpcaoRelatorio === '0') {
                    break;
                }
                readlineSync.question('Pressione Enter para continuar...');
            }
            break;
        }

        // Opção 5: Gerenciar Cardápio
        case "5": {
            clearConsole();
            console.log("\n=====================================================");
            console.log("             GERENCIAR CARDÁPIO");
            console.log("=======================================================");
            const fileName = "cardapio.txt";
            let cardapio = getLines(fileName);

            console.log("Cardápio Atual:");
            cardapio.forEach(p => {
                const [id, sabor, ingredientes, preco, status] = p.split(';');
                const statusTexto = status === '1' ? 'DISPONÍVEL' : 'INDISPONÍVEL';
                console.log(`[ID: ${id}] - ${sabor} - Preço: R$ ${preco} - Status: ${statusTexto}`);
            });

            console.log("\nOpções de Gerenciamento:");
            console.log("[1] Deletar sabor");
            console.log("[2] Tornar indisponível");
            console.log("[3] Tornar disponível");
            console.log("[0] Voltar ao menu principal");

            const subOpcao = readlineSync.question('Digite a opção desejada: ');
            if (subOpcao === '0') {
                break;
            }

            const pizzaId = readlineSync.question('Digite o ID da pizza para gerenciar: ');
            const pizzaIndex = cardapio.findIndex(p => p.startsWith(`${pizzaId};`));

            if (pizzaIndex === -1) {
                console.log("\nErro: Pizza não encontrada com o ID informado.");
            } else {
                switch (subOpcao) {
                    case '1':
                        cardapio.splice(pizzaIndex, 1);
                        console.log("\nPizza deletada com sucesso!");
                        break;
                    case '2':
                        const pizzaIndisponivel = cardapio[pizzaIndex].split(';');
                        pizzaIndisponivel[4] = '0';
                        cardapio[pizzaIndex] = pizzaIndisponivel.join(';');
                        console.log("\nPizza alterada para indisponível com sucesso!");
                        break;
                    case '3':
                        const pizzaDisponivel = cardapio[pizzaIndex].split(';');
                        pizzaDisponivel[4] = '1';
                        cardapio[pizzaIndex] = pizzaDisponivel.join(';');
                        console.log("\nPizza alterada para disponível com sucesso!");
                        break;
                    default:
                        console.log("\nOpção inválida.");
                        break;
                }
                fs.writeFileSync(fileName, cardapio.join('\n') + '\n', 'utf-8');
            }
            break;
        }

        // Opção 6: Gerenciar Clientes
        case "6": {
            clearConsole();
            console.log("\n=====================================================");
            console.log("             GERENCIAR CADASTROS");
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
                        clientes.splice(clienteIndex, 1);
                        console.log("\nCadastro de cliente deletado com sucesso!");
                        break;
                    case '2':
                        clienteDados[5] = '0';
                        clientes[clienteIndex] = clienteDados.join(';');
                        console.log("\nCliente banido com sucesso!");
                        break;
                    case '3':
                        console.log("\nDigite as novas informações para o cliente (deixe em branco para não alterar):");
                        const novoNome = readlineSync.question(`Novo Nome (${clienteDados[1]}): `) || clienteDados[1];
                        const novoTelefone = readlineSync.question(`Novo Telefone (${clienteDados[2]}): `) || clienteDados[2];
                        const novoEndereco = readlineSync.question(`Novo Endereco (${clienteDados[3]}): `) || clienteDados[3];
                        const novoCpf = readlineSync.question(`Novo CPF (${clienteDados[4]}): `) || clienteDados[4];
                        
                        clientes[clienteIndex] = `${clienteDados[0]};${novoNome};${novoTelefone};${novoEndereco};${novoCpf};${clienteDados[5]}`;
                        console.log("\nInformações do cliente editadas com sucesso!");
                        break;
                    default:
                        console.log("\nOpção inválida.");
                        break;
                }
                fs.writeFileSync(fileName, clientes.join('\n') + '\n', 'utf-8');
            }
            break;
        }

        // Opção 7: Fechar Sistema
        case "7": {
            // A gente sai do loop principal, então o programa termina
            break;
        }

        // Opção padrão para qualquer coisa que não seja um número de 1 a 7
        default: {
            console.log("Opção inválida. Selecione uma opção de 1 a 7.");
        }
    }
    
    // Checa se a opção não é a de fechar o sistema para mostrar a mensagem
    if (opmenu !== "7") {
      readlineSync.question('\nPressione Enter para continuar...');
    } else {
        // Se for 7, a gente sai do loop
        break;
    }
}