-----

## SISTEMA PIZZASYSTEM

Este projeto foi desenvolvido como parte dos estudos de Programação TypeScript no segundo semestre de Ciência da Computação. O objetivo é criar um sistema de gerenciamento de pizzaria simples, rodando no console, para praticar conceitos de manipulação de dados, estruturas de controle e interações com o usuário via terminal.
    
    ALUNOS:
    
    GUSTAVO ZAIA PASTRO (RA 2506964)
    DAVI GONÇALVES SILVA (RA 2505783)

-----

## Visão Geral

O *Pizzasystem* é uma aplicação de console que simula o fluxo de trabalho de uma pizzaria. Ele permite o cadastro de clientes e **múltiplas categorias de produtos** (pizzas e outros itens), o gerenciamento do cardápio e de cadastros, a geração de pedidos e a emissão de relatórios de vendas. Todos os dados são persistidos em arquivos de texto (.txt) que funcionam como um banco de dados simples.

-----

## Funcionalidades

O sistema é operado através de um menu principal e submenus, com as seguintes opções:

  * **[1] Cadastro de Cliente:** Permite adicionar novos clientes ao sistema. Cada cliente recebe um ID sequencial e é salvo no arquivo `cadastroCliente.txt` com seu nome, telefone, endereço, CPF e status (ativo por padrão).
  * **[2] Cadastro de Produtos:** Esta opção agora apresenta um submenu para o cadastro de diferentes tipos de produtos:
      * **Cadastro de Pizza:** Adiciona novos sabores de pizza ao cardápio. Cada pizza recebe um ID e é salva no arquivo `cardapio.txt` com seu sabor, ingredientes, preço e status (disponível por padrão).
      * **Cadastro de Outros Produtos:** Permite adicionar itens como bebidas e sobremesas. Cada produto recebe um ID e é salvo no arquivo `outrosProdutos.txt` com seu nome, preço e status (disponível por padrão).
  * **[3] Gerar Pedido:** O coração do sistema. Esta funcionalidade valida a existência do cliente e dos produtos, verifica a disponibilidade e guia o usuário para a finalização do pedido. Agora, o sistema permite adicionar **outros produtos** além da pizza, calculando o valor total do pedido com todos os itens. O comprovante é exibido no console e o pedido completo é salvo no arquivo `pedidos.txt`.
  * **[4] Relatórios:** Um submenu que permite visualizar relatórios de vendas de forma organizada.
      * **Relatório Diário:** Exibe todos os pedidos do dia atual, com detalhes sobre **pizzas e outros produtos**, quantidades, valor total e forma de pagamento.
      * **Relatório Mensal:** Similar ao relatório diário, mas filtra e exibe todos os pedidos do mês atual.
  * **[5] Gerenciar Cardápio:** Permite a manutenção dos sabores de pizza. É possível deletar uma pizza do cardápio, ou mudar seu status para **"indisponível"** ou **"disponível"** sem precisar removê-la.
  * **[6] Gerenciar Cadastros:** Permite o gerenciamento dos clientes. É possível deletar um cliente do cadastro, banir um cliente (o que o impede de fazer novos pedidos) ou editar suas informações de contato.
  * **[7] Fechar Sistema:** Encerra a execução do programa.

-----

## Como Executar o Projeto

Para rodar este sistema, você precisa ter o **Node.js** instalado. Ele já vem com o npm, o gerenciador de pacotes.

### 1\. Dependências

As dependências são os pacotes que o projeto precisa para funcionar. Elas estão listadas no arquivo `package.json`. Para instalar todas de uma vez, execute o seguinte comando no terminal:

```bash
npm install
```

### 2\. Iniciar o Sistema

Depois de instalar as dependências, siga os passos abaixo para iniciar o projeto:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/DaviGons/PizzaSystem.git
    cd PizzaSystem
    ```
2.  **Inicie o Sistema:**
    ```bash
    npx tsc
    node dist/index.js
    
-----
