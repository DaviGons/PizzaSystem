import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para __dirname (necessário para módulos ES)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// --- CONFIGURAÇÕES BÁSICAS E INSEGURAS ---
app.use(express.json()); // Aceita corpo JSON
app.use(cors()); // Permite acesso de qualquer origem (inseguro, mas simples)
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos

// Configuração do Banco de Dados (Credenciais fixas e inseguras)
const dbConfig = {
    user: 'sa',
    password: 'SenhaFacul123', // NOVA SENHA DE BAIXA SEGURANÇA
    server: 'localhost',
    database: 'PizzaSystem',
    options: { encrypt: false, trustServerCertificate: true }
};

async function connectDB() {
    try {
        await sql.connect(dbConfig);
        console.log('✅ Banco de Dados Conectado! (Sem Segurança)');
    } catch (err) {
        // Se a conexão falhar, tenta reconectar
        console.error('❌ Erro ao conectar (tentando novamente em 5s):', err.message);
        setTimeout(connectDB, 5000); 
    }
}
connectDB(); // Tenta conectar

// --- ROTAS DE PÁGINAS ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cliente.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'funcionario.html')));

// --- API (Totalmente Pública e Sem Autenticação) ---

// 1. CLIENTES
app.get('/api/clientes', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Clientes`;
        const data = result.recordset.map(c => ({
            id: c.Id.toString(),
            nome: c.Nome,
            telefone: c.Telefone,
            endereco: c.Endereco,
            cpf: c.Cpf
        }));
        res.json(data);
    } catch (e) { res.status(500).json(e); }
});

app.post('/api/clientes', async (req, res) => {
    const { nome, telefone, endereco, cpf } = req.body;
    try {
        await sql.query`INSERT INTO Clientes (Nome, Telefone, Endereco, Cpf) VALUES (${nome}, ${telefone}, ${endereco}, ${cpf})`;
        res.sendStatus(201);
    } catch (e) { res.status(500).send(e.message); }
});

app.delete('/api/clientes/:id', async (req, res) => {
    try {
        await sql.query`DELETE FROM Clientes WHERE Id = ${req.params.id}`;
        res.sendStatus(200);
    } catch (e) { res.status(500).send(e.message); }
});

// 2. PIZZAS
app.get('/api/pizzas', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Pizzas`;
        const data = result.recordset.map(p => ({
            id: p.Id.toString(),
            sabor: p.Sabor,
            ingredientes: p.Ingredientes,
            preco: p.Preco,
            status: p.Status ? '1' : '0'
        }));
        res.json(data);
    } catch (e) { res.status(500).json(e); }
});

app.post('/api/pizzas', async (req, res) => {
    const { sabor, ingredientes, preco } = req.body;
    try {
        await sql.query`INSERT INTO Pizzas (Sabor, Ingredientes, Preco) VALUES (${sabor}, ${ingredientes}, ${preco})`;
        res.sendStatus(201);
    } catch (e) { res.status(500).send(e.message); }
});

app.delete('/api/pizzas/:id', async (req, res) => {
    try {
        await sql.query`DELETE FROM Pizzas WHERE Id = ${req.params.id}`;
        res.sendStatus(200);
    } catch (e) { res.status(500).send(e.message); }
});

// 3. OUTROS PRODUTOS
app.get('/api/outros', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM OutrosProdutos`;
        const data = result.recordset.map(o => ({
            id: o.Id.toString(),
            nome: o.Nome,
            preco: o.Preco,
            status: o.Status ? '1' : '0'
        }));
        res.json(data);
    } catch (e) { res.status(500).json(e); }
});

app.post('/api/outros', async (req, res) => {
    const { nome, preco } = req.body;
    try {
        await sql.query`INSERT INTO OutrosProdutos (Nome, Preco) VALUES (${nome}, ${preco})`;
        res.sendStatus(201);
    } catch (e) { res.status(500).send(e.message); }
});

app.delete('/api/outros/:id', async (req, res) => {
    try {
        await sql.query`DELETE FROM OutrosProdutos WHERE Id = ${req.params.id}`;
        res.sendStatus(200);
    } catch (e) { res.status(500).send(e.message); }
});

// 4. PEDIDOS
app.get('/api/pedidos', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Pedidos ORDER BY Id DESC`;
        const data = result.recordset.map(p => {
            let itemExtraObj = null;
            try { if(p.DetalhesJson) itemExtraObj = JSON.parse(p.DetalhesJson); } catch(e) {}
            return {
                id: p.Id.toString(),
                clienteId: p.ClienteId ? p.ClienteId.toString() : '0',
                pizzaId: p.PizzaId ? p.PizzaId.toString() : null,
                qtdPizza: p.QtdPizza,
                valorTotal: p.ValorTotal,
                status: p.Status,
                formaPagamento: p.FormaPagamento,
                itemExtra: itemExtraObj
            };
        });
        res.json(data);
    } catch (e) { res.status(500).send(e.message); }
});

app.post('/api/pedidos', async (req, res) => {
    const { clienteId, pizzaId, qtdPizza, itemExtra, valorTotal, formaPagamento, status } = req.body;
    const detalhesString = itemExtra ? JSON.stringify(itemExtra) : null;
    try {
        await sql.query`
            INSERT INTO Pedidos (ClienteId, PizzaId, QtdPizza, ValorTotal, Status, FormaPagamento, DetalhesJson)
            VALUES (${clienteId}, ${pizzaId}, ${qtdPizza}, ${valorTotal}, ${status}, ${formaPagamento}, ${detalhesString})
        `;
        res.sendStatus(201);
    } catch (e) { res.status(500).send(e.message); }
});

app.put('/api/pedidos/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await sql.query`UPDATE Pedidos SET Status = ${status} WHERE Id = ${req.params.id}`;
        res.sendStatus(200);
    } catch (e) { res.status(500).send(e.message); }
});

app.delete('/api/pedidos/:id', async (req, res) => {
    try {
        await sql.query`DELETE FROM Pedidos WHERE Id = ${req.params.id}`;
        res.sendStatus(200);
    } catch (e) { res.status(500).send(e.message); }
});

// --- START ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});