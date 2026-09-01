---
name: mindmap-editor
description: Especificação do editor de mapas mentais com React Flow — nós interativos, layout Dagre, auto-save, atalhos de teclado. Use ao trabalhar em MindMap.tsx, InteractiveNode, hooks de nó ou layout.
---

# Editor de Mapas Mentais

## Arquitetura do editor

```
MindMap.tsx
└── ReactFlowProvider
    └── FlowContent
        ├── ReactFlow (canvas)
        ├── HeaderPanel (save status, voltar)
        ├── OnboardingBanner (primeira visita)
        └── Background + Controls
```

`nodeTypes` registra apenas `interactive: InteractiveNode`.

## Modelo de nó

```typescript
interface InteractiveNodeData {
    label: string;
    side?: 'right' | 'left';
    parentId?: string; // ID do nó pai (ausente no root)
    isEditing?: boolean; // true ao criar nó novo
}
```

- Tipo: `'interactive'`
- Handles: `left`, `left-target`, `right`, `right-target`
- Nó raiz de projetos novos: `id: 'root'`, sem `parentId`
- Nó raiz do demo: `id: 'demo-root'`, `deletable: false`

## Operações de nó (`useNodeHandler`)

| Ação                  | Função                               | Comportamento                                |
| --------------------- | ------------------------------------ | -------------------------------------------- |
| Filho (Tab / botão +) | `createAdjacentNode(id, direction?)` | Cria nó adjacente, conecta com edge colorida |
| Irmão (Enter)         | `createSiblingNode(id)`              | Cria filho do `parentId` do nó atual         |
| Deletar (Delete)      | `deleteNode(id)`                     | Remove nó + descendentes; bloqueia `root`    |

Após criar/deletar, chamar `layoutNodes()` com delay de ~100ms.

## Cores de conexão

`getConnectionColor(childIndex)` em `colorUtils.ts` — cor baseada na posição entre irmãos. Aplicar em `edge.style.stroke` e `edge.data.color`.

## Layout automático (`useLayoutNodes`)

- Dagre com `rankdir: 'LR'` (esquerda → direita)
- Dimensões fixas: `nodeWidth: 172`, `nodeHeight: 36`
- Define `sourcePosition: Right`, `targetPosition: Left`
- Invocado após mudanças estruturais (criar/deletar nós)

## Auto-save

Em `FlowContent`:

1. Carregar projeto com `getProject(projectId)` no mount
2. `useEffect` em `[nodes, edges]` chama `saveData()` — **pular** quando `isInitialLoad.current === true`
3. `saveData` usa `updateProjectData` e atualiza `saveStatus`: `idle` → `saving` → `saved` → `idle` (2s)
4. `isSavingRef` evita saves concorrentes

## Atalhos de teclado

Capturados em `InteractiveNode.handleKeyDown` (com `preventDefault` + `stopPropagation`):

| Tecla    | Ação                     |
| -------- | ------------------------ |
| `Tab`    | Criar nó filho (direita) |
| `Enter`  | Criar nó irmão           |
| `Delete` | Remover nó selecionado   |

## Configuração React Flow

```typescript
const flowConfig = {
    selectionMode: SelectionMode.Partial,
    multiSelectionKeyCode: 'Shift',
};
```

## Onboarding

- Chave: `ONBOARDING_KEY` (`mindmap_onboarding_seen`)
- Exibido na primeira visita ao editor; dismiss grava no localStorage

## Checklist ao alterar o editor

- [ ] Novos tipos de nó registrados em `nodeTypes`
- [ ] Layout recalculado após mudanças estruturais
- [ ] Auto-save não dispara no carregamento inicial
- [ ] Handles de conexão consistentes com edges existentes
- [ ] Nó root protegido contra deleção
