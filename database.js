import sql from 'mssql';

// -------------------------------------------------------------------
// FASE 1: SCRIPT PARA CRIAR O BANCO DE DADOS
// -------------------------------------------------------------------
const databaseCreationSql = `
    IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'PizzaSystem')
    BEGIN
        CREATE DATABASE PizzaSystem;
    END
`;

// -------------------------------------------------------------------
// FASE 2: SCRIPT PARA CRIAR AS TABELAS DENTRO DO BANCO
// -------------------------------------------------------------------
const tableCreationSql = `
    CREATE TABLE Clientes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(100), Telefone NVARCHAR(20), Endereco NVARCHAR(200), Cpf NVARCHAR(20), Status BIT DEFAULT 1
    );

    CREATE TABLE Pizzas (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Sabor NVARCHAR(100), Ingredientes NVARCHAR(MAX), Preco DECIMAL(10,2), Status BIT DEFAULT 1
    );

    CREATE TABLE OutrosProdutos (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(100), Preco DECIMAL(10,2), Status BIT DEFAULT 1
    );

    CREATE TABLE Pedidos (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ClienteId INT, PizzaId INT, QtdPizza INT, ValorTotal DECIMAL(10,2), 
        Status NVARCHAR(50), FormaPagamento NVARCHAR(50), DetalhesJson NVARCHAR(MAX), DataHora DATETIME DEFAULT GETDATE()
    );
`;

const masterConfig = {
    user: 'sa',
    password: 'SenhaFacul123',
    server: 'localhost',
    database: 'master', // Conecta ao master para criar o DB
    options: { encrypt: false, trustServerCertificate: true, requestTimeout: 60000 }
};

const pizzaSystemConfig = {
    ...masterConfig,
    database: 'PizzaSystem' // Conecta ao PizzaSystem para criar as tabelas
};

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeSql(config, sqlScript, stepName, retries = 10, delay = 5000) {
    console.log(`\nIniciando ${stepName}...`);
    
    for (let i = 0; i < retries; i++) {
        let pool;
        try {
            pool = await sql.connect(config);
            console.log(`✅ Conexão com o SQL Server estabelecida (${config.database}).`);

            const request = pool.request();
            // multiple=true é necessário se o script tiver 'GO' ou comandos de lote
            // Mas para estes scripts simplificados, não é estritamente necessário
            await request.query(sqlScript);
            
            console.log(`✅ ${stepName} concluída com sucesso!`);
            return; 

        } catch (err) {
            console.log(`Tentativa ${i + 1} falhou. Motivo: ${err.message}.`);
            if (i < retries - 1) {
                console.log(`Aguardando ${delay / 1000}s para re-tentar...`);
                await sleep(delay);
            } else {
                console.error(`\n❌ ERRO FATAL no ${stepName}: Falhou após todas as tentativas. Verifique o Docker e as credenciais.`);
                console.error(err.message);
                process.exit(1);
            }
        } finally {
            if (pool) await pool.close();
        }
    }
}

async function setupDatabase() {
    // 1. Cria o banco de dados 'PizzaSystem' no Master
    await executeSql(masterConfig, databaseCreationSql, "Criação do Banco de Dados 'PizzaSystem'");

    // 2. Cria as tabelas dentro do 'PizzaSystem'
    await executeSql(pizzaSystemConfig, tableCreationSql, "Criação das Tabelas");

    console.log("\n🚀 Configuração do banco de dados concluída. Você já pode iniciar o server.js!");
}

setupDatabase();