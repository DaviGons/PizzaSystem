// Importando as bibliotecas que vamos usar.
// 'readline-sync' é pra conseguir ler o que o usuário digita no console de forma síncrona.
// 'fs' (File System) é a biblioteca do Node.js pra manipular arquivos, como ler e salvar.
import * as readlineSync from 'readline-sync';
import * as fs from "fs";

// Uma função pra limpar a tela do console.
// A gente usa 'process.stdout.write' com um código especial ('\x1Bc') pra garantir
// que funcione em todos os terminais, já que 'console.clear()' nem sempre funciona.
const clearConsole = () => {
  process.stdout.write('\x1Bc');
};

// Funções para lidar com arquivos
// Essa função lê um arquivo e retorna um array com cada linha.
// É útil pra não ter que ficar repetindo esse código de leitura.
const getLines = (fileName: string): string[] => {
    // Primeiro, checamos se o arquivo existe. Se não, retornamos um array vazio.
    if (!fs.existsSync(fileName)) {
        return [];
    }
    const data = fs.readFileSync(fileName, 'utf-8');
    // A CORREÇÃO ESTÁ AQUI: Substituímos todos os \r por uma string vazia.
    const cleanData = data.replace(/\r/g, '');
    // Lê todo o conteúdo, tira os espaços do começo/fim e separa por quebra de linha ('\n').
    // O '.filter(Boolean)' remove qualquer linha que esteja em branco.
    return cleanData.trim().split('\n').filter(Boolean);
};

// Refatoramos essa função pra ela gerar o próximo ID pra qualquer arquivo.
// O 'padLength' é um parâmetro opcional que define quantos zeros à esquerda teremos (ex: 3 para 001).
const gerarProximoId = (fileName: string, padLength: number = 3): string => {
    const linhas = getLines(fileName);
    // Se o arquivo estiver vazio, o primeiro ID é 1.
    if (linhas.length === 0) {
        return '1'.padStart(padLength, '0');
    }
    // Pega a última linha do arquivo, separa pelo ';' e pega a primeira parte (o ID).
    const ultimoIdString = linhas[linhas.length - 1].split(';')[0];
    // Converte o ID pra um número, soma 1 e teremos o próximo ID.
    const proximoId = parseInt(ultimoIdString) + 1;
    // Formata o número pra ter o comprimento desejado, preenchendo com zeros à esquerda.
    return proximoId.toString().padStart(padLength, '0');
};

// =========================================================================================
// FUNÇÕES DE INTERFACE MAIS LIMPA
// =========================================================================================

// Exibe a lista de clientes de forma limpa, mostrando ID, nome e status.
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

// Exibe o cardápio de forma limpa, mostrando apenas as pizzas disponíveis.
// A gente filtra pela coluna de status (índice 4) antes de exibir.
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

// =========================================================================================
// FIM DAS FUNÇÕES
// =========================================================================================

// Início do nosso loop principal. Ele vai rodar infinitamente até que a gente use o 'break'.
while (true) {
    // Limpa a tela pra gente sempre ver o menu principal de forma organizada.
    clearConsole();
    
    // Mostra as opções do menu no console.
    console.log("=====================================================");
    console.log("SISTEM DE PIZZARIA PIZZASYSTEM");
    console.log("SELECIONE OPÇÕES DE 1-9");
    console.log("[1] Cadastro de Cliente");
    console.log("[2] Cadastro de Produtos");
    console.log("[3] Gerar pedido");
    console.log("[4] Gerar relatório do dia");
    console.log("[5] Gerenciar Cardápio");
    console.log("[6] Gerenciar Cadastros");
    console.log("[7] Fechar Sistema");
    console.log("=====================================================");
    // Pergunta qual opção o usuário quer. A resposta é uma string.
    let opmenu: string = readlineSync.question("Digite a Opção Desejada:");

    // === OPÇÃO [1] CADASTRO DE CLIENTE ===
    // 'if' para quando a opção de menu for '1'.
    if (opmenu === "1"){
        clearConsole();
        console.log("\n=====================================================");
        console.log("             CADASTRO DE CLIENTE");
        console.log("=======================================================");
        const fileName = "cadastroCliente.txt"
        // Pede os dados do cliente e guarda em variáveis.
        const nome: string = readlineSync.question('Nome: ');
        const telefone: string = readlineSync.question('Telefone: ');
        const endereco: string = readlineSync.question('Endereco: ');
        const cpf: string = readlineSync.question('CPF: ');
        // Usa nossa função pra gerar o próximo ID com 3 dígitos.
        const id = gerarProximoId(fileName, 3);
        // Junta todos os dados em uma única string, no formato que o arquivo exige, com status '1' (ativo).
        const dadosCliente = `${id};${nome};${telefone};${endereco};${cpf};1\n`;
        // Adiciona a string no final do arquivo sem apagar o que já existe.
        fs.appendFileSync(fileName, dadosCliente, 'utf-8');

        console.log("\nCliente cadastrado com sucesso!");
        console.log(`ID gerado: ${id}`);
        console.log("=====================================================\n");
    }

    // === OPÇÃO [2] CADASTRO DE PRODUTOS ===
    // 'if' para quando a opção de menu for '2'.
    if (opmenu === "2"){
        clearConsole();
        console.log("\n=====================================================");
        console.log("             CADASTRO DE PIZZA");
        console.log("=======================================================");
        const fileName = "cardapio.txt"
        // Pede os dados da pizza.
        const sabor: string = readlineSync.question('Sabor: ');
        const ingredientes: string = readlineSync.question('Ingredientes: ');
        // ATENÇÃO: A gente usa 'questionFloat()' aqui pra garantir que o preço seja um número.
        // Isso evita o erro de 'NaN' que tivemos antes!
        const preco: number = readlineSync.questionFloat('Preço: ');
        // Gera o ID da pizza com 2 dígitos.
        const id = gerarProximoId(fileName, 2);
        // Agora, a gente inclui o status '1' (disponível) ao final da linha.
        const dadosPizza = `${id};${sabor};${ingredientes};${preco.toFixed(2)};1\n`;
        fs.appendFileSync(fileName, dadosPizza, 'utf-8');

        console.log("\nSabor de Pizza Cadastrado com Sucesso!");
        console.log(`ID gerado: ${id}`);
        console.log("=====================================================\n");
    }

    // === OPÇÃO [3] GERAR PEDIDO ===
    // 'if' para quando a opção de menu for '3'.
    if (opmenu === "3") {
        clearConsole();
        console.log("\n=====================================================");
        console.log("                GERAR PEDIDO");
        console.log("=======================================================");
        // Lemos todos os clientes e o cardápio dos arquivos.
        const clientes = getLines("cadastroCliente.txt");
        const cardapio = getLines("cardapio.txt");

        // Agora, usamos as novas funções pra exibir as listas de forma organizada.
        exibirClientes(clientes);
        exibirCardapio(cardapio);
        
        const clienteId = readlineSync.question('Digite o ID do cliente: ');
        const pizzaId = readlineSync.question('Digite o ID da pizza: ');
        const quantidade = readlineSync.questionInt('Digite a quantidade: ');
        // Usamos 'find()' pra buscar na lista o cliente e a pizza com base no ID.
        const cliente = clientes.find(c => c.startsWith(`${clienteId};`));
        const pizza = cardapio.find(p => p.startsWith(`${pizzaId};`));
        // Verificamos se encontramos os dados.
        if (!cliente) {
            console.log("\nErro: Cliente não encontrado.");
        } else if (cliente.split(';')[5] === '0') {
            // VERIFICA SE O CLIENTE ESTÁ BANIDO
            console.log("\nErro: Este cliente está banido e não pode fazer pedidos.");
        } else if (!pizza) {
            console.log("\nErro: Pizza não encontrada.");
        } else if (pizza.split(';')[4] === '0') {
            // Verificamos se a pizza está disponível.
            console.log("\nErro: A pizza selecionada está indisponível.");
        } else {
            // Se tudo estiver certo, pegamos o preço e calculamos o valor total.
            const precoUnitario = parseFloat(pizza.split(';')[3]);
            const valorTotal = (precoUnitario * quantidade).toFixed(2);
            // Criamos um novo objeto 'Date' pra pegar a data e hora atual.
            const data = new Date();
            // Formatamos a data e hora para salvar no arquivo.
            const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
            const horaFormatada = `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}:${data.getSeconds().toString().padStart(2, '0')}`;
            const dataPedido = `${dataFormatada} ${horaFormatada}`;
            // Geramos o ID para o pedido e salvamos os dados.
            const idPedido = gerarProximoId("pedidos.txt", 4);
            const dadosPedido = `${idPedido};${clienteId};${pizzaId};${quantidade};${valorTotal};${dataPedido}\n`;
            fs.appendFileSync("pedidos.txt", dadosPedido, 'utf-8');
            console.log("\nPedido gerado com sucesso!");
            console.log(`ID do Pedido: ${idPedido}`);
            console.log(`Valor Total: R$ ${valorTotal}`);
        }
    }
    
    // === OPÇÃO [4] RELATÓRIO DO DIA ===
    // 'if' para quando a opção de menu for '4'.
    if (opmenu === "4"){
        clearConsole();
        console.log("\n=====================================================");
        console.log("             RELATÓRIO DE PEDIDOS DO DIA");
        console.log("=====================================================");
        // Lemos todos os dados de clientes, pedidos e cardápio.
        const pedidos = getLines("pedidos.txt");
        const clientes = getLines("cadastroCliente.txt");
        const cardapio = getLines("cardapio.txt");
        // Pegamos a data atual pra comparar com a data dos pedidos.
        const data = new Date();
        const dataAtual = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
        // Filtramos a lista de pedidos pra pegar só os do dia de hoje.
        const pedidosDoDia = pedidos.filter(pedido => {
            const dadosPedido = pedido.split(';');
            const dataPedido = dadosPedido[5].split(' ')[0]; 
            return dataPedido === dataAtual;
        });

        let totalDiario = 0;
        // Se não houver pedidos no dia, mostra uma mensagem.
        if (pedidosDoDia.length === 0) {
            console.log("Nenhum pedido encontrado para a data de hoje.");
        } else {
            // Percorre cada pedido do dia pra exibir os detalhes.
            pedidosDoDia.forEach(pedido => {
                const [idPedido, idCliente, idPizza, quantidade, valorTotal, data] = pedido.split(';');
                // Usa 'find()' pra buscar os dados do cliente e da pizza.
                const cliente = clientes.find(c => c.startsWith(`${idCliente};`));
                const pizza = cardapio.find(p => p.startsWith(`${idPizza};`));
                // Pega os nomes ou exibe uma mensagem de erro.
                const nomeCliente = cliente ? cliente.split(';')[1] : 'Cliente não encontrado';
                const saborPizza = pizza ? pizza.split(';')[1] : 'Pizza não encontrada';
                // Exibe os dados do pedido.
                console.log(`\n-----------------------------------------------------`);
                console.log(`Pedido ID: ${idPedido}`);
                console.log(`Cliente: ${nomeCliente} (ID: ${idCliente})`);
                console.log(`Pizza: ${saborPizza} (ID: ${idPizza})`);
                console.log(`Quantidade: ${quantidade}`);
                console.log(`Valor Total: R$ ${valorTotal}`);
                console.log(`Data/Hora: ${data}`);
                // Soma o valor do pedido ao total do dia.
                totalDiario += parseFloat(valorTotal);
            });
            // Exibe o total de vendas do dia formatado.
            console.log(`\n=====================================================`);
            console.log(`Total de vendas do dia: R$ ${totalDiario.toFixed(2)}`);
        }

        console.log("=====================================================\n");
        
        // Se houver pedidos, dá a opção de apagar o arquivo do dia pra começar de novo amanhã.
        if (pedidosDoDia.length > 0) {
            readlineSync.question('Relatório gerado. Pressione Enter para limpar os pedidos do dia...');
            // Limpa o conteúdo do arquivo 'pedidos.txt'.
            fs.writeFileSync("pedidos.txt", '', 'utf-8');
            console.log('Pedidos do dia apagados com sucesso!');
        }
    }

    // === OPÇÃO [5] GERENCIAR CARDÁPIO ===
    // Lógica para gerenciar as pizzas do cardápio (deletar ou mudar status)
    if (opmenu === "5"){
        clearConsole();
        console.log("\n=====================================================");
        console.log("             GERENCIAR CARDÁPIO");
        console.log("=======================================================");
        const fileName = "cardapio.txt";
        let cardapio = getLines(fileName);

        // Primeiro, mostramos o cardápio atual com status.
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
            // Volta para o menu principal
            continue;
        }

        const pizzaId = readlineSync.question('Digite o ID da pizza para gerenciar: ');
        const pizzaIndex = cardapio.findIndex(p => p.startsWith(`${pizzaId};`));

        if (pizzaIndex === -1) {
            console.log("\nErro: Pizza não encontrada com o ID informado.");
        } else {
            switch (subOpcao) {
                case '1':
                    // Deleta a pizza do array
                    cardapio.splice(pizzaIndex, 1);
                    console.log("\nPizza deletada com sucesso!");
                    break;
                case '2':
                    // Muda o status da pizza para '0' (indisponível)
                    const pizzaIndisponivel = cardapio[pizzaIndex].split(';');
                    pizzaIndisponivel[4] = '0';
                    cardapio[pizzaIndex] = pizzaIndisponivel.join(';');
                    console.log("\nPizza alterada para indisponível com sucesso!");
                    break;
                case '3':
                    // Muda o status da pizza para '1' (disponível)
                    const pizzaDisponivel = cardapio[pizzaIndex].split(';');
                    pizzaDisponivel[4] = '1';
                    cardapio[pizzaIndex] = pizzaDisponivel.join(';');
                    console.log("\nPizza alterada para disponível com sucesso!");
                    break;
                default:
                    console.log("\nOpção inválida.");
                    break;
            }
            // Salva as alterações no arquivo, sobrescrevendo o conteúdo antigo
            fs.writeFileSync(fileName, cardapio.join('\n') + '\n', 'utf-8');
        }
    }
    
    // === OPÇÃO [6] GERENCIAR CADASTROS ===
    // 'if' para quando a opção de menu for '6'.
    // Lógica para gerenciar cadastros de clientes (deletar, banir, editar).
    if (opmenu === "6") {
        clearConsole();
        console.log("\n=====================================================");
        console.log("             GERENCIAR CADASTROS");
        console.log("=======================================================");
        const fileName = "cadastroCliente.txt";
        let clientes = getLines(fileName);
        // Primeiro, mostramos a lista de clientes com seus status.
        exibirClientes(clientes);

        console.log("\nOpções de Gerenciamento:");
        console.log("[1] Deletar cadastro");
        console.log("[2] Banir cadastro");
        console.log("[3] Editar informações");
        console.log("[0] Voltar ao menu principal");

        const subOpcao = readlineSync.question('Digite a opção desejada: ');
        if (subOpcao === '0') {
            continue;
        }

        const clienteId = readlineSync.question('Digite o ID do cliente para gerenciar: ');
        const clienteIndex = clientes.findIndex(c => c.startsWith(`${clienteId};`));

        if (clienteIndex === -1) {
            console.log("\nErro: Cliente não encontrado com o ID informado.");
        } else {
            let clienteDados = clientes[clienteIndex].split(';');

            switch (subOpcao) {
                case '1':
                    // Deleta o cliente do array
                    clientes.splice(clienteIndex, 1);
                    console.log("\nCadastro de cliente deletado com sucesso!");
                    break;
                case '2':
                    // Muda o status do cliente para '0' (banido)
                    clienteDados[5] = '0';
                    clientes[clienteIndex] = clienteDados.join(';');
                    console.log("\nCliente banido com sucesso!");
                    break;
                case '3':
                    // Edita as informações do cliente
                    console.log("\nDigite as novas informações para o cliente (deixe em branco para não alterar):");
                    const novoNome = readlineSync.question(`Novo Nome (${clienteDados[1]}): `) || clienteDados[1];
                    const novoTelefone = readlineSync.question(`Novo Telefone (${clienteDados[2]}): `) || clienteDados[2];
                    const novoEndereco = readlineSync.question(`Novo Endereco (${clienteDados[3]}): `) || clienteDados[3];
                    const novoCpf = readlineSync.question(`Novo CPF (${clienteDados[4]}): `) || clienteDados[4];
                    
                    // Reconstroi a linha com as novas informações, mantendo o ID e o status
                    clientes[clienteIndex] = `${clienteDados[0]};${novoNome};${novoTelefone};${novoEndereco};${novoCpf};${clienteDados[5]}`;
                    console.log("\nInformações do cliente editadas com sucesso!");
                    break;
                default:
                    console.log("\nOpção inválida.");
                    break;
            }
            // Salva as alterações no arquivo, sobrescrevendo o conteúdo antigo
            fs.writeFileSync(fileName, clientes.join('\n') + '\n', 'utf-8');
        }
    }
    
    if (opmenu === "7"){
        // Se o usuário digitar '7', o loop principal é interrompido e o programa termina.
        break;
    }
    
    // Pausa o programa pra o usuário poder ler a mensagem da opção escolhida.
    if (opmenu !== "7"){
      readlineSync.question('\nPressione Enter para continuar...');
    }
}