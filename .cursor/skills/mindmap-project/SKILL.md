---
name: mindmap-project
description: Arquitetura, estrutura de pastas, scripts e convenções de código do projeto MindMap. Use ao iniciar trabalho no repositório, adicionar features, ou quando precisar entender como o app está organizado.
---

# MindMap — Arquitetura do Projeto

## Visão geral

App SPA de mapas mentais interativos. Dois fluxos principais:

1. **Dashboard** (`ProjectsPage`) — CRUD de projetos, export/import de backup JSON
2. **Editor** (`MindMap`) — canvas React Flow com auto-save

Navegação simples via estado em `App.tsx` (`page: 'projects' | 'mindmap'`). Sem React Router.

## Estrutura de pastas

```
src/
├── pages/           # ProjectsPage, MindMap
├── components/      # UI reutilizável (modais, header, sidebar, nós)
├── hooks/           # Lógica de editor, tema, layout
├── context/         # ToastContext
├── utils/           # projectManager, colorUtils, api (legado)
├── data/            # initialNodes, initialEdges, demoProject
├── icons/           # LoadingSpinner
├── constants.ts     # URLs, BRAND_COLOR, ONBOARDING_KEY
├── App.tsx          # Roteamento por estado + providers
└── App.css          # Estilos globais e React Flow
```

## Providers (ordem em App.tsx)

```tsx
<ThemeProvider>
    <ToastProvider>
        <AppContent />
        <ToastContainer />
    </ToastProvider>
</ThemeProvider>
```

## Convenções de código

| Área        | Padrão                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------ |
| Componentes | Functional components, `React.FC` opcional                                                       |
| Exports     | `export default` para componentes/páginas; named exports para utils/hooks                        |
| IDs         | `ulid()` para projetos e nós novos; `root` para nó raiz de projetos criados                      |
| Async       | Funções de `projectManager` retornam `Promise` (interface async mesmo com localStorage síncrono) |
| Idioma UI   | Inglês em labels, toasts e mensagens de erro                                                     |
| Estilo      | Prettier + ESLint flat config; lint-staged no pre-commit                                         |

## Scripts

| Comando            | Uso                                            |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Dev server (porta 5173)                        |
| `npm run build`    | Build produção (`tsc -b && vite build`)        |
| `npm run test`     | Vitest (run once)                              |
| `npm run validate` | typecheck + lint + format:check + test + build |

## Deploy

- GitHub Pages via `.github/workflows/deploy.yml`
- `VITE_BASE_PATH: /MindMap/` no build de deploy
- Push em `main`/`master` dispara deploy automático

## Princípios para contribuições

1. **Escopo mínimo** — alterar só o necessário para a tarefa
2. **Reutilizar** — estender hooks/componentes existentes em vez de duplicar
3. **Sem backend** — persistência exclusivamente em `localStorage`
4. **Sem over-engineering** — evitar abstrações para casos únicos

## Dependências principais

- `@xyflow/react` v12 — canvas e nós
- `dagre` — layout automático LR
- `lucide-react` — ícones
- `ulid` — geração de IDs
- TailwindCSS 4 via `@tailwindcss/vite`

## Skills relacionadas

- Editor: [mindmap-editor/SKILL.md](../mindmap-editor/SKILL.md)
- Persistência: [mindmap-persistence/SKILL.md](../mindmap-persistence/SKILL.md)
- UI: [mindmap-ui/SKILL.md](../mindmap-ui/SKILL.md)
- Testes: [mindmap-testing/SKILL.md](../mindmap-testing/SKILL.md)
