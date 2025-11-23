
# 🍕 PizzaSystem

Um sistema de gerenciamento de pizzaria desenvolvido para fins acadêmicos, demonstrando a evolução de uma aplicação de console para uma arquitetura web completa.

O projeto está dividido em duas versões funcionais:

1.  **Versão Web (Full Stack):** Interface gráfica, API Node.js e Banco de Dados SQL.
2.  **Versão Console (TypeScript):** Interface via terminal e persistência em arquivos de texto.

-----

## 📋 Pré-requisitos Globais

Para executar qualquer uma das versões, você precisa ter instalado:

  * **[Node.js](https://nodejs.org/)** (v18 ou superior)
  * **Git** (Para clonar o repositório)
  * **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Apenas para a Versão Web)

-----

## 🖥️ Opção 1: Versão Console (TypeScript)

Esta versão roda diretamente no terminal, utilizando lógica de negócios pura e manipulação de arquivos de texto simples para persistência.

### Passo a Passo:

1.  **Instalar Dependências:**
    No terminal, na raiz do projeto, baixe as bibliotecas necessárias, incluindo o TypeScript e a biblioteca `readline-sync`:

    ```bash
    npm install
    ```

2.  **Compilar o Código:**
    O código-fonte está em **TypeScript** (`src/index.ts`), e precisa ser transpilado para JavaScript:

    ```bash
    npx tsc
    ```

    *Isso irá gerar uma pasta `/dist` com os arquivos compilados, conforme configurado em `tsconfig.json`*.

3.  **Executar:**
    Rode o arquivo principal compilado:

    ```bash
    node dist/index.js
    ```

4.  **Uso:**
    Siga as instruções interativas que aparecerão no terminal para gerenciar clientes, produtos e pedidos. Os dados serão salvos em arquivos `.txt` (como `cadastroCliente.txt` e `pedidos.txt`) na raiz do projeto.

-----

## 🌐 Opção 2: Versão Web (Full Stack)

Esta versão utiliza uma arquitetura moderna com interface web, uma API (Node.js/Express) e um banco de dados SQL Server rodando via Docker.

### Passo a Passo:

1.  **Instalar Dependências:**
    No terminal, na raiz do projeto, baixe todas as dependências do Node.js:

    ```bash
    npm install
    ```

2.  **Subir o Banco de Dados (Docker):**
    Certifique-se que o **Docker Desktop** está aberto e execute o comando para iniciar o contêiner do SQL Server:

    ```bash
    docker-compose up -d
    ```

    *Aguarde cerca de **20 segundos** para o banco iniciar completamente. A senha de acesso SA é `SenhaFacul123`*.

3.  **Configurar o Banco (Criação de Tabelas):**
    O script `database.js` contém a lógica para criar o banco de dados chamado `PizzaSystem` e as tabelas (Clientes, Pizzas, Pedidos, etc.).

      * Rode o script de configuração:
        ```bash
        node database.js
        ```

4.  **Iniciar o Servidor (API):**
    Execute o arquivo principal do backend:

    ```bash
    node server.js
    ```

    *O terminal exibirá: `🚀 Servidor rodando em http://localhost:3000`*.

5.  **Acessar no Navegador:**

      * **Área do Cliente:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
      * **Área do Funcionário (Admin):** [http://localhost:3000/admin](https://www.google.com/search?q=http://localhost:3000/admin)
          * **Login de Acesso:** `admin` / `admin`.

-----

## ⚠️ Notas Importantes

  * **Limpeza do Banco:** Se precisar limpar completamente o banco de dados (remover contêiner e dados), rode: `docker-compose down -v`.
  * **Porta:** Se a porta `3000` estiver em uso, você precisará alterar a constante `PORT` no arquivo `server.js`.
  * **Versões Independentes:** Os dados da **Versão Console** (arquivos `.txt`) **não** são compartilhados com a **Versão Web** (SQL Server). São sistemas totalmente independentes.
