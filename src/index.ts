import * as readlineSync from 'readline-sync';
import * as fs from "fs";



// CONSOLE MENU
while (true) {
    console.log("=====================================================");
    console.log("SISTEM DE PIZZARIA PIZZASYSTEM");
    console.log("SELECIONE OPÇÕES DE 1-9");
    console.log("[1] Cadastro de Cliente");
    console.log("[2] Cadastro de Produtos");
    console.log("[3] Gerar pedido");
    console.log("[4] Gerar relatório do dia");
    console.log("[5] Gerar Relatorio Mensal");
    console.log("[6] Gerenciar Cardápio");
    console.log("[7] Gerenciar Cadastros");
    console.log("[8] Fechar Sistema");
    console.log("=====================================================");
    let opmenu: string = readlineSync.question("Digite a Opção Desejada:");

    if (opmenu === "1"){
        const gerarProximoId = (): string => {
            if (!fs.existsSync(fileName) || fs.readFileSync(fileName, 'utf-8').trim() === '') {
                return '001';
            }
            
            const data = fs.readFileSync(fileName, 'utf-8');
            const linhas = data.trim().split('\n').filter(Boolean);
            const ultimoIdString = linhas[linhas.length - 1].split(';')[0];
            const proximoId = parseInt(ultimoIdString) + 1;
            
            return proximoId.toString().padStart(3, '0');
        };
        console.log("\n=====================================================");
        console.log("             CADASTRO DE CLIENTE");
        console.log("=======================================================");
        const fileName = "cadastroCliente.txt"

        const nome: string = readlineSync.question('Nome: ');
        const telefone: string = readlineSync.question('Telefone: ');
        const endereco: string = readlineSync.question('Endereco: ');
        const cpf: string = readlineSync.question('CPF: ');
        const id = gerarProximoId();
        const dadosCliente = `${id};${nome};${telefone};${endereco};${cpf}\n`;
        fs.appendFileSync(fileName, dadosCliente, 'utf-8');

        console.log("\nCliente cadastrado com sucesso!");
        console.log(`ID gerado: ${id}`);
        console.log("=====================================================\n");
    }
    if (opmenu === "2"){
        
    }
    if (opmenu === "3"){
        
    }
    if (opmenu === "4"){
        
    }
    if (opmenu === "5"){
        
    }
    if (opmenu === "6"){
        
    }
    if (opmenu === "7"){
        
    }
    if (opmenu === "8"){
        break;   
    }
}
