# 🚀 PizzaSystem

Um sistema simples de gerenciamento de pizzaria para console (TypeScript) e web (HTML), criado para fins de estudo. Persiste os dados em arquivos `.txt` (versão console) ou `LocalStorage` (versão web).

**Autores:**

- GUSTAVO ZAIA PASTRO (RA 2506964)
- DAVI GONÇALVES SILVA (RA 2505783)

---

## 🍕 Funcionalidades Principais

- **Cadastro de Clientes:** Adiciona, edita, bane ou remove clientes.
- **Cadastro de Produtos:** Adiciona pizzas e outros itens (bebidas, sobremesas).
- **Gerar Pedido:** Cria um pedido com pizza e itens extras para um cliente válido.
- **Gerenciar Cardápio:** Altera a disponibilidade (disponível/indisponível) ou deleta produtos.
- **Relatórios:** Gera relatórios de vendas diários e mensais.

---

## ⚡ Como Executar

Este projeto possui duas versões que podem ser executadas de formas diferentes.

### 1\. Versão Console (TypeScript)

Requer [Node.js](https://nodejs.org/) (que inclui o `npm`) instalado em sua máquina.

**1. Clone o repositório:**

```bash
git clone https://github.com/DaviGons/PizzaSystem.git
cd PizzaSystem
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Compile o TypeScript e rode o sistema:**

```bash
npx tsc
node dist/index.js
```

O sistema será iniciado no seu terminal.

### 2\. Versão Web (HTML)

Esta versão é _standalone_ e não requer instalação. Ela usa o `LocalStorage` do seu navegador para salvar os dados.

1.  Clone o repositório (se ainda não o fez).
2.  Navegue até a pasta `HTML_VERSION` dentro do projeto.
3.  Abra o arquivo `index.html` diretamente no seu navegador (ex: Google Chrome, Firefox).

---

## 📊 Fluxograma do Sistema

![image_alt](https://github.com/DaviGons/PizzaSystem/blob/3d81666e8d44812cdaf21d5313618a1e6a8469f7/fluxo.jpg)
