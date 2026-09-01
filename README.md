# MindMap

Uma aplicação web interativa para criação e gestão de mapas mentais, desenvolvida com uma arquitetura moderna de Frontend e um Backend leve. O projeto permite criar nós, estabelecer conexões e organizar ideias visualmente com recursos de layout automático.

![](public/demo.jpeg)

## 🚀 Funcionalidades

- **Mapas Mentais Interativos:** Criação de nós e arestas com interface "drag-and-drop" utilizando [React Flow](https://reactflow.dev/).
- **Layout Automático:** Organização automática dos nós para melhor visualização (baseado em Dagre).
- **Gestão de Projetos:** Criação, salvamento e listagem de múltiplos projetos de mapas mentais.
- **Autenticação de Utilizadores:** Sistema de Login e Registo de utilizadores.
- **Temas:** Suporte a deteção de tema (Claro/Escuro).
- **Nós Interativos:** Capacidade de adicionar, editar e expandir nós diretamente na interface.

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 19** + **Vite** (Build tool e Framework)
- **TypeScript** (Tipagem estática)
- **React Flow (@xyflow/react)** (Biblioteca de grafos/mapas)
- **Zustand** (Gestão de estado)
- **TailwindCSS** (Estilização)
- **Lucide React** (Ícones)
- **Dagre** (Algoritmo de layout de grafos)

### Backend

- **PHP** (API RESTful simples)
- **SQLite** (Base de dados leve baseada em ficheiro)

## 📂 Estrutura do Projeto

```text
mind-map/
├── backend/            # API PHP e base de dados SQLite
│   ├── auth_middleware.php
│   ├── database.php
│   ├── login.php
│   └── ...
├── src/                # Código fonte Frontend (React)
│   ├── components/     # Componentes reutilizáveis (Nós, Modais, Paineis)
│   ├── hooks/          # Custom Hooks (Layout, Cores, Eventos)
│   ├── pages/          # Páginas da aplicação (Login, Projetos, MindMap)
│   ├── utils/          # Utilitários e chamadas à API
│   └── ...
├── index.html
├── package.json
└── vite.config.ts
```

## ⚙️ Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (gestor de pacotes)
- **Servidor PHP:** Necessário para rodar a pasta `/backend` (ex: Apache, Nginx, ou o servidor embutido do PHP).
- **Extensão SQLite:** Habilitada no PHP (`php.ini`).

## 🚀 Instalação e Execução

### 1. Configurar o Backend

A aplicação requer que o backend PHP esteja a correr para funcionar a autenticação e o salvamento de dados.

1. Navegue até à pasta backend:

```bash
cd backend
```

2. Garanta que a pasta `backend/` tem permissões de escrita (a base de dados é criada automaticamente).
3. Inicie um servidor PHP embutido para testes (na porta 8000, por exemplo):

```bash
php -S localhost:8000
```

_Nota: Poderá ser necessário ajustar a URL da API no frontend (`src/utils/api.ts`) caso a porta seja diferente._

### 2. Configurar o Frontend

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Aceda à aplicação no navegador (geralmente em `http://localhost:5173`).

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento Vite.
- `npm run build`: Compila o TypeScript e gera a build de produção.
- `npm run lint`: Executa o ESLint para verificar a qualidade do código.
- `npm run preview`: Visualiza a build de produção localmente.

## 🔒 Base de Dados

O projeto utiliza **SQLite**. O ficheiro `backend/mindmap.sqlite` é gerado automaticamente na primeira execução.
O script `backend/database.php` gere a conexão e a criação das tabelas (`users`, `projects`, etc.).

---

Desenvolvido com ❤️ utilizando React e PHP.
