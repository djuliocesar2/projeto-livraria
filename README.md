# 📚 Sistema de Gestão - Rede de Livrarias LIVRO

Este projeto foi desenvolvido como parte da **Atividade Prática Integradora** do curso de Ciência da Computação da **UNIP**, sob a orientação do professor **André de Lira Muniz (@agdelira)**.

A solução foca no **Cenário 4**, modernizando a gestão da rede de livrarias LIVRO através de uma arquitetura modular que integra lojas físicas e e-commerce em tempo real.

## 🚀 Principais Funcionalidades

- **Sincronização de Estoque Real-Time:** Atualização imediata entre vendas no balcão e disponibilidade no site.
- **Modo Offline Resiliente:** Capacidade de processar vendas mesmo sem conexão com a internet, utilizando persistência local para sincronização posterior.
- **Busca Avançada Instantânea:** Mecanismo de pesquisa otimizado por ISBN, Autor ou Gênero.
- **Reposição Automática (RN-02):** Lógica de negócio que gera ordens de compra automáticas ao atingir o estoque crítico definido para cada título.

## 📚 Catálogo de Testes (Dados Iniciais)

O sistema inicia com os seguintes livros pré-cadastrados para validação:

| ISBN | Título | Autor | Gênero | Preço | Estoque Crítico |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **97801** | O Programador Pragmático | Andrew Hunt | Tecnologia | R$ 95,00 | 5 unidades |
| **97802** | Engenharia de Software | Ian Sommerville | Educação | R$ 180,00 | 3 unidades |
| **97803** | Código Limpo | Robert C. Martin | Tecnologia | R$ 85,00 | 5 unidades |
| **97804** | Dom Casmurro | Machado de Assis | Literatura | R$ 45,00 | 2 unidades |
| **97805** | Algoritmos: Teoria e Prática | Thomas Cormen | Tecnologia | R$ 220,00 | 4 unidades |

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React (Hooks, Axios, LocalStorage)
- **Back-end:** Node.js com Express
- **Banco de Dados:** SQLite (Relacional)
- **Arquitetura:** REST API (Decoupled Architecture)

## 📋 Engenharia de Requisitos

### Requisitos Funcionais (RF)
- **RF-01:** Sincronizar estoque entre PDV e E-commerce.
- **RF-02:** Pesquisa rápida por metadados de livros.
- **RF-05:** Operação ininterrupta em modo offline.

### Requisitos Não Funcionais (RNF)
- **RNF-01:** Baixa latência nas consultas (resposta instantânea).
- **RNF-03:** Conformidade com a LGPD para segurança de dados.
- **RNF-06:** Arquitetura modular via APIs abertas.

## ⚙️ Como Executar o Projeto

1. **Backend:**
   - Acesse a pasta `backend`: `cd backend`
   - Instale as dependências: `npm install`
   - Inicie o servidor: `node server.js`

2. **Frontend:**
   - Acesse a pasta `frontend`: `cd frontend`
   - Instale as dependências: `npm install`
   - Inicie a aplicação: `npm start`

---
**Desenvolvido por:** Julio Cesar Nascimento (RA: R02067-3)  
**Instituição:** UNIP - Ciência da Computação  
**Professor Orientador:** André de Lira Muniz