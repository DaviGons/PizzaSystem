# 🍕 PizzaSystem

Um sistema de gerenciamento de pizzaria desenvolvido para fins acadêmicos, demonstrando a evolução de uma aplicação de console para uma arquitetura web completa.

O projeto está dividido em duas versões funcionais:
1.  **Versão Web (Full Stack):** Interface gráfica, API Node.js e Banco de Dados SQL.
2.  **Versão Console (TypeScript):** Interface via terminal e persistência em arquivos de texto.

**Autores:**
- **GUSTAVO ZAIA PASTRO** (RA 2506964)
- **DAVI GONÇALVES SILVA** (RA 2505783)

---

## 📋 Pré-requisitos Globais

Para executar qualquer uma das versões, você precisa ter instalado:

* **[Node.js](https://nodejs.org/)** (v18 ou superior)
* **Git** (Para clonar o repositório)
* **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Apenas para a Versão Web)

---

## 🖥️ Opção 1: Versão Console (TypeScript)

Esta versão roda diretamente no terminal. É ideal para testar a lógica de negócios pura e manipulação de arquivos.

**Arquitetura:** TypeScript → Transpilação para JS → Node.js → Persistência em `.txt`.

### Passo a Passo:

1.  **Instalar Dependências:**
    No terminal, na raiz do projeto, baixe as bibliotecas do TypeScript:
    ```bash
    npm install
    ```

2.  **Compilar o Código:**
    O Node.js não roda TypeScript nativamente. Precisamos converter para JavaScript:
    ```bash
    npx tsc
    ```
    *Isso irá gerar uma pasta `/dist` com os arquivos compilados.*

3.  **Executar:**
    Rode o arquivo principal gerado:
    ```bash
    node dist/index.js
    ```

4.  **Uso:**
    Siga as instruções interativas que aparecerão no terminal para cadastrar clientes e pedidos. Os dados serão salvos em arquivos `.txt` na raiz do projeto.

---

## 🌐 Opção 2: Versão Web (Full Stack)

Esta é a versão moderna com interface gráfica, API e Banco de Dados real.

**Arquitetura:** HTML/JS (Frontend) ↔ Node.js/Express (Backend) ↔ SQL Server (Docker).

### Passo a Passo:

1.  **Subir o Banco de Dados:**
    Certifique-se que o Docker Desktop está aberto e execute:
    ```bash
    docker-compose up -d
    ```
    *Aguarde cerca de 20 segundos para o banco iniciar.*

2.  **Configurar o Banco (Apenas na 1ª vez):**
    O banco nasce vazio. Você precisa criar as tabelas.
    * Acesse **[http://localhost:8080](http://localhost:8080)** (Adminer).
    * **Login:** Sistema: `MS SQL`, Servidor: `sqlserver`, Usuário: `sa`, Senha: `Pizza!Password123`.
    * Clique em **"Comando SQL"** e execute o script de criação (disponível no arquivo `database.sql` ou na documentação do projeto).

3.  **Iniciar o Servidor (API):**
    ```bash
    node server.js
    ```
    *O terminal exibirá: `🚀 Servidor rodando em http://localhost:3000`*

4.  **Acessar no Navegador:**
    * **Área do Cliente:** [http://localhost:3000](http://localhost:3000)
    * **Área do Funcionário:** [http://localhost:3000/admin](http://localhost:3000/admin) (Login: `admin` / `admin`).

---

## 📂 Estrutura de Arquivos

Entenda onde está cada parte do projeto:

```text
/PizzaSystem
│
├── src/                 # Código Fonte da Versão Console (TypeScript)
│   └── index.ts         # Ponto de entrada do Console
│
├── dist/                # Código Compilado da Versão Console (Gerado automático)
│
├── public/              # Frontend da Versão Web
│   ├── cliente.html     # Interface do Cliente
│   ├── funcionario.html # Interface do Admin
│   └── *.js / *.css     # Scripts e Estilos
│
├── server.js            # Backend da Versão Web (API Node.js)
├── docker-compose.yml   # Configuração do Banco de Dados
├── package.json         # Gerenciador de dependências
└── tsconfig.json        # Configuração do TypeScript
````

-----

## ⚠️ Notas Importantes

  * **Conflito de Portas:** Se não conseguir rodar o servidor web, verifique se a porta `3000` já não está sendo usada.
  * **Dados:** Os dados da Versão Console (arquivos `.txt`) **não** são compartilhados com a Versão Web (SQL Server). São sistemas independentes.
  * **Reiniciar Banco:** Se precisar limpar o banco de dados, rode `docker-compose down -v` e depois suba novamente.
