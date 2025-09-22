# SISTEMA PIZZASYSTEM

Este projeto foi desenvolvido como parte dos estudos de Programação Orientada a Objetos no segundo semestre de Ciência da Computação. O objetivo é criar um sistema de gerenciamento de pizzaria simples, rodando no console, para praticar conceitos de manipulação de dados, estruturas de controle e interações com o usuário via terminal.
    
    ALUNOS:
    
    GUSTAVO ZAIA PASTRO (RA 2506964)
    DAVI GONÇALVES SILVA (RA 2505783)
-----

## Visão Geral

O *Pizzasystem* é uma aplicação de console que simula o fluxo de trabalho de uma pizzaria. Ele permite o cadastro de clientes e produtos, o gerenciamento do cardápio e de cadastros, a geração de pedidos e a emissão de relatórios de vendas. Todos os dados são persistidos em arquivos de texto (.txt) que funcionam como um banco de dados simples.

-----

## Funcionalidades

O sistema é operado através de um menu principal e submenus, com as seguintes opções:

  * *[1] Cadastro de Cliente:* Permite adicionar novos clientes ao sistema. Cada cliente recebe um ID sequencial e é salvo no arquivo cadastroCliente.txt com seu nome, telefone, endereço, CPF e status (ativo por padrão).
  * *[2] Cadastro de Produtos:* Permite adicionar novos sabores de pizza ao cardápio. Cada pizza recebe um ID e é salva no arquivo cardapio.txt com seu sabor, ingredientes, preço e status (disponível por padrão).
  * *[3] Gerar Pedido:* O coração do sistema. Esta funcionalidade valida a existência do cliente e da pizza, verifica se a pizza está disponível, e guia o usuário para a finalização do pedido, incluindo a escolha da forma de pagamento. O comprovante do pedido é exibido no console e salvo no arquivo pedidos.txt.
  * *[4] Relatórios:* Um submenu que permite visualizar relatórios de vendas de forma organizada.
      * *Relatório Diário:* Exibe todos os pedidos do dia atual, com detalhes como cliente, pizza, quantidade, valor total e forma de pagamento. Ao final, mostra o total de vendas do dia e oferece a opção de apagar os registros do dia para começar um novo dia de vendas.
      * *Relatório Mensal:* Similar ao relatório diário, mas filtra e exibe todos os pedidos do mês atual.
  * *[5] Gerenciar Cardápio:* Permite a manutenção dos sabores de pizza. É possível deletar uma pizza do cardápio, ou mudar seu status para "indisponível" ou "disponível" sem precisar removê-la.
  * *[6] Gerenciar Cadastros:* Permite o gerenciamento dos clientes. É possível deletar um cliente do cadastro, banir um cliente (o que impede que ele faça novos pedidos) ou editar suas informações de contato.
  * *[7] Fechar Sistema:* Encerra a execução do programa.

-----

## Como Executar o Projeto

Para rodar este sistema, você precisa ter o *Node.js* instalado em sua máquina. O Node.js já vem com o npm, o gerenciador de pacotes.

1.  *Clone o Repositório:*
    ```bash
    git clone https://github.com/DaviGons/PizzaSystem.git
    cd PizzaSystem
    
2.  *Instale as Dependências:*
    ```bash
    npm install
    
3.  *Inicie o Sistema:*
    ```bash
    npx tsc
    node dist/index.js
    
-----