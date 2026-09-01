# MindMap

Aplicação web interativa para criação de mapas mentais — projeto de portfólio com persistência local no browser, sem backend.

![](public/demo.jpeg)

**Demo ao vivo:** [guilhermeroesler.github.io/MindMap](https://guilhermeroesler.github.io/MindMap/)

## Funcionalidades

- **Mapas mentais interativos:** criação de nós e conexões com [React Flow](https://reactflow.dev/)
- **Layout automático:** organização dos nós com Dagre
- **Dashboard de projetos:** CRUD completo (criar, renomear, abrir, apagar)
- **Projeto demo:** mapa pré-carregado na primeira visita para explorar as funcionalidades
- **Persistência local:** dados salvos em `localStorage` — sem servidor, sem login
- **Temas:** suporte a modo claro e escuro
- **Deploy automático:** GitHub Pages via GitHub Actions

## Tecnologias

- **React 19** + **Vite** + **TypeScript**
- **React Flow (@xyflow/react)** — grafos interativos
- **TailwindCSS** — estilização
- **Dagre** — layout automático
- **Vitest** — testes unitários

## Estrutura

```text
mind-map/
├── src/
│   ├── components/     # Nós, header, sidebar, modais
│   ├── data/           # Nós iniciais e projeto demo
│   ├── hooks/          # Layout, cores, edição de nós
│   ├── pages/          # Dashboard e editor MindMap
│   └── utils/          # projectManager (localStorage)
├── .github/workflows/  # CI + deploy GitHub Pages
└── vite.config.ts
```

## Instalação

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Scripts

| Script             | Descrição                                |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Servidor de desenvolvimento              |
| `npm run build`    | Build de produção                        |
| `npm run preview`  | Preview da build local                   |
| `npm run test`     | Testes unitários                         |
| `npm run validate` | typecheck + lint + format + test + build |

## Deploy (GitHub Pages)

O workflow `.github/workflows/deploy.yml` publica automaticamente em cada push para `main`.

1. Em **Settings → Pages**, selecione **GitHub Actions** como source
2. Faça push para `main` — o deploy roda sozinho
3. A app fica em `https://<usuario>.github.io/MindMap/`

Para build local com o mesmo base path do Pages:

```bash
VITE_BASE_PATH=/MindMap/ npm run build
```

## Persistência

Os projetos ficam em `localStorage` (chave `mindmap_projects`). Na primeira visita, um **Demo Mind Map** é criado automaticamente. Dados são locais ao browser — limpar cache ou trocar de dispositivo apaga os projetos.

## CI

- **`.github/workflows/ci.yml`:** typecheck, lint, format, testes e build em PRs e pushes
- **`.github/workflows/deploy.yml`:** build + deploy para GitHub Pages

---

Desenvolvido com React e React Flow.
