import * as readlineSync from 'readline-sync';
import * as fs from "fs";

// Função para limpar o console de forma confiável
const clearConsole = () => {
  process.stdout.write('\x1Bc');
};

// Funções para lidar com arquivos
const getLines = (fileName: string): string[] => {
    if (!fs.existsSync(fileName)) {
        return [];
    }
    const data = fs.readFileSync(fileName, 'utf-8');
    return data.trim().split('\n').filter(Boolean);
};

// Refatora a função para gerar o próximo ID para qualquer arquivo
const gerarProximoId = (fileName: string, padLength: number = 3): string => {
    const linhas = getLines(fileName);
    if (linhas.length === 0) {
        return '1'.padStart(padLength, '0');
    }
    const ultimoIdString = linhas[linhas.length - 1].split(';')[0];
    const proximoId = parseInt(ultimoIdString) + 1;
    return proximoId.toString().padStart(padLength, '0');
};

while (true) {
    clearConsole();
    
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
    let opmenu: string = readlineSync.question("Digite a Opção Desejada:");

    // === OPÇÃO [1] CADASTRO DE CLIENTE ===
    if (opmenu === "1"){
        clearConsole();
        console.log("\n=====================================================");
        console.log("             CADASTRO DE CLIENTE");
        console.log("=======================================================");
        const fileName = "cadastroCliente.txt"

        const nome: string = readlineSync.question('Nome: ');
        const telefone: string = readlineSync.question('Telefone: ');
        const endereco: string = readlineSync.question('Endereco: ');
        const cpf: string = readlineSync.question('CPF: ');
        const id = gerarProximoId(fileName, 3);
        const dadosCliente = `${id};${nome};${telefone};${endereco};${cpf}\n`;
        fs.appendFileSync(fileName, dadosCliente, 'utf-8');

        console.log("\nCliente cadastrado com sucesso!");
        console.log(`ID gerado: ${id}`);
        console.log("=====================================================\n");
    }

    // === OPÇÃO [2] CADASTRO DE PRODUTOS ===
    if (opmenu === "2"){
        clearConsole();
        console.log("\n=====================================================");
        console.log("             CADASTRO DE PIZZA");
        console.log("=======================================================");
        const fileName = "cardapio.txt"

        const sabor: string = readlineSync.question('Sabor: ');
        const ingredientes: string = readlineSync.question('Ingredientes: ');
        const preco: number = readlineSync.questionFloat('Preço: ');
        const id = gerarProximoId(fileName, 2);
        const dadosPizza = `${id};${sabor};${ingredientes};${preco};\n`;
        fs.appendFileSync(fileName, dadosPizza, 'utf-8');

        console.log("\nSabor de Pizza Cadastrado com Sucesso!");
        console.log(`ID gerado: ${id}`);
        console.log("=====================================================\n");
    }

    // === OPÇÃO [3] GERAR PEDIDO ===
    if (opmenu === "3") {
        clearConsole();
        console.log("\n=====================================================");
        console.log("                GERAR PEDIDO");
        console.log("=======================================================");

        const clientes = getLines("cadastroCliente.txt");
        const cardapio = getLines("cardapio.txt");
        console.log("Clientes Cadastrados:");
        clientes.forEach(c => console.log(c));
        console.log("\nCardápio Disponível:");
        cardapio.forEach(p => console.log(p));
        console.log("=======================================================");

        const clienteId = readlineSync.question('Digite o ID do cliente: ');
        const pizzaId = readlineSync.question('Digite o ID da pizza: ');
        const quantidade = readlineSync.questionInt('Digite a quantidade: ');
        const cliente = clientes.find(c => c.startsWith(`${clienteId};`));
        const pizza = cardapio.find(p => p.startsWith(`${pizzaId};`));

        if (!cliente) {
            console.log("\nErro: Cliente não encontrado.");
        } else if (!pizza) {
            console.log("\nErro: Pizza não encontrada.");
        } else {
            const precoUnitario = parseFloat(pizza.split(';')[3]);
            const valorTotal = (precoUnitario * quantidade).toFixed(2);
            const dataPedido = new Date().toLocaleString();
            const idPedido = gerarProximoId("pedidos.txt", 4);
            const dadosPedido = `${idPedido};${clienteId};${pizzaId};${quantidade};${valorTotal};${dataPedido}\n`;
            fs.appendFileSync("pedidos.txt", dadosPedido, 'utf-8');
            console.log("\nPedido gerado com sucesso!");
            console.log(`ID do Pedido: ${idPedido}`);
            console.log(`Valor Total: R$ ${valorTotal}`);
        }
    }
    
    if (opmenu === "4"){
        
    }
    if (opmenu === "5"){
        
    }
    if (opmenu === "6"){
        
    }
    if (opmenu === "7"){
        break;
    }
    
    // Adiciona uma pausa para que o usuário possa ler a mensagem
    if (opmenu !== "7"){
      readlineSync.question('\nPressione Enter para continuar...');
    }
}