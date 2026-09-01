---
name: mindmap-persistence
description: Camada de persistência local do MindMap — interface Project, localStorage, CRUD, import/export JSON, projeto demo. Use ao alterar projectManager.ts, dados iniciais ou fluxos de backup.
---

# Persistência de Projetos

## Interface Project

```typescript
interface Project {
    id: string;
    name: string;
    nodes: Node[]; // @xyflow/react
    edges: Edge[]; // @xyflow/react
    updatedAt: string; // ISO 8601
    isDemo?: boolean;
}
```

## Storage

| Chave              | Conteúdo                        |
| ------------------ | ------------------------------- |
| `mindmap_projects` | `Project[]` serializado em JSON |

Toda persistência centralizada em `src/utils/projectManager.ts`. Não acessar `localStorage` diretamente fora deste módulo (exceto chaves de tema/onboarding).

## Inicialização

`ensureInitialized()`:

1. Tenta `loadProjects()` — retorna `[]` se vazio ou JSON inválido
2. Se vazio, cria projeto demo via `seedDemoProject()` e persiste
3. Chamado internamente por todas as operações públicas

## API pública

| Função                                | Descrição                                                       |
| ------------------------------------- | --------------------------------------------------------------- |
| `getProjects()`                       | Lista ordenada por `updatedAt` desc                             |
| `getProject(id)`                      | Busca por ID ou `null`                                          |
| `createProject(name)`                 | Novo projeto com `initialNodes`/`initialEdges`, ID via `ulid()` |
| `updateProjectData(id, nodes, edges)` | Atualiza canvas; lança se ID não existe                         |
| `renameProject(id, name)`             | Renomeia (trim no nome)                                         |
| `deleteProject(id)`                   | Remove; **bloqueia** se `isDemo === true`                       |
| `exportProjects()`                    | JSON formatado de todos os projetos                             |
| `importProjects(json, mode)`          | Importa com validação                                           |

## Projeto demo

Definido em `src/data/demoProject.ts`:

- `DEMO_PROJECT_ID = 'demo'`
- `DEMO_PROJECT_NAME = 'Demo Mind Map'`
- `isDemo: true` — não deletável
- Nós/edges pré-configurados com `createEdge()` helper

## Dados iniciais de projetos novos

`src/data/nodes.tsx` → `initialNodes` (nó `root`)
`src/data/edges.tsx` → `initialEdges` (vazio)

## Import/Export

### Export

`exportProjects()` retorna JSON de todos os projetos. Usado pelo botão "Export backup" no dashboard.

### Import

```typescript
importProjects(json: string, mode: 'merge' | 'replace'): Promise<number>
```

**Validação** (`isValidProject`):

- Objeto com `id`, `name`, `nodes[]`, `edges[]`, `updatedAt` (todos tipados corretamente)

**Modo `replace`**:

- Recria demo + importa projetos (exclui demo duplicado do arquivo)

**Modo `merge`**:

- Adiciona apenas projetos com IDs novos (pula demo e IDs existentes)
- Retorna quantidade adicionada

**Erros lançados**:

- `'Invalid JSON file.'`
- `'Expected an array of projects.'`
- `'No valid projects found in file.'`

## Regras de negócio

1. Demo sempre presente após inicialização ou replace
2. Demo nunca deletável
3. `updatedAt` atualizado em toda mutação
4. IDs de projeto: `ulid()`; nó raiz de novos projetos: `'root'`
5. Funções são `async` para interface consistente (futuro backend)

## Checklist ao alterar persistência

- [ ] Validação de schema em imports
- [ ] Demo preservado em cenários de replace
- [ ] `updatedAt` atualizado
- [ ] Testes em `projectManager.test.ts` cobrindo novo comportamento
- [ ] Sem acesso direto a `localStorage` fora do módulo
