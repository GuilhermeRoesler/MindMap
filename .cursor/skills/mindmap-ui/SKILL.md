---
name: mindmap-ui
description: Padrões de UI, tema claro/escuro, componentes e estilos do MindMap. Use ao criar ou alterar componentes, modais, CSS, tema ou constantes visuais.
---

# UI e Tema

## Identidade visual

| Token           | Valor                  | Uso                                       |
| --------------- | ---------------------- | ----------------------------------------- |
| `BRAND_COLOR`   | `#6f34dc`              | Botões primários, seleção de nós, acentos |
| Fonte           | Poppins (Google Fonts) | Global via `App.css`                      |
| Body bg (light) | `#f8f9fa`              | Fundo padrão                              |
| Texto           | `#343a40`              | Cor base                                  |

## Sistema de tema

Provider: `src/hooks/useTheme.tsx`

```typescript
type ThemeMode = 'light' | 'dark' | 'system';
```

| Chave localStorage | `mindmap_theme`                                                  |
| ------------------ | ---------------------------------------------------------------- |
| Aplicação DOM      | `document.documentElement.dataset.theme` + classe `dark-theme`   |
| Hook               | `useTheme()` → `{ themeMode, isDark, setThemeMode, cycleTheme }` |
| Ciclo              | system → light → dark → system                                   |

`ThemeToggle` no header alterna via `cycleTheme()`.

## Estrutura de componentes

### Layout do dashboard

```
ProjectsPage
├── Sidebar (links, tema, GitHub)
├── Header (título, ações)
├── DashboardHero (CTA criar projeto)
└── Grid de cards de projeto
```

### Modais

| Componente           | Props principais                                                  |
| -------------------- | ----------------------------------------------------------------- |
| `CreateProjectModal` | `isOpen`, `onClose`, `onCreate(name)`                             |
| `RenameProjectModal` | `isOpen`, `onClose`, `onRename(name)`, `currentName`              |
| `ConfirmModal`       | `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `isLoading` |

Padrão: overlay + card centralizado, animação `fadeIn`.

### Editor

| Componente         | Função                                                        |
| ------------------ | ------------------------------------------------------------- |
| `HeaderPanel`      | Voltar ao dashboard, status de save (`idle`/`saving`/`saved`) |
| `OnboardingBanner` | Dicas de atalhos na primeira visita                           |
| `ShortcutsPanel`   | Painel de atalhos (toggle)                                    |
| `InteractiveNode`  | Nó customizado do canvas                                      |
| `AddButton`        | Botões + esquerda/direita nos nós                             |

## Toasts

`ToastContext` + `ToastContainer`:

```typescript
showToast(message: string, type: 'success' | 'error' | 'info')
```

Usado no dashboard para feedback de CRUD e import/export.

## Estilos

### App.css

- Estilos globais, animações (`fadeIn`, `shake`)
- Overrides do React Flow (`.react-flow__node`, handles, edges)
- Temas via `[data-theme="dark"]` e `.dark-theme`
- Classes utilitárias do dashboard e modais

### TailwindCSS 4

Configurado via `@tailwindcss/vite` no `vite.config.ts`. Usar classes utilitárias em componentes JSX quando apropriado; estilos complexos do canvas ficam em `App.css`.

### Seleção de nó no canvas

```css
.react-flow__node.selected .interactive-node {
    outline: 2px solid #6f34dc;
    box-shadow: 0 6px 16px rgba(111, 52, 220, 0.2);
}
```

## Constantes (`constants.ts`)

```typescript
GITHUB_REPO_URL; // link do repositório
LIVE_DEMO_URL; // GitHub Pages
BRAND_COLOR; // #6f34dc
ONBOARDING_KEY; // mindmap_onboarding_seen
```

## Padrões de componente

1. Props tipadas com interface dedicada
2. Estados de loading com `LoadingSpinner`
3. Modais controlados por `isOpen` boolean no pai
4. Ícones via `lucide-react`
5. Mensagens de UI em inglês

## Checklist ao alterar UI

- [ ] Funciona em light e dark (`isDark` / `dark-theme`)
- [ ] Cor da marca consistente (`BRAND_COLOR`)
- [ ] Feedback ao usuário via toast quando aplicável
- [ ] Modais acessíveis (foco, escape para fechar se já implementado)
- [ ] Sem regressão visual no canvas React Flow
