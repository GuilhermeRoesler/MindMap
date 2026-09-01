---
name: mindmap-testing
description: Padrões de testes unitários com Vitest para o MindMap — setup, mocks de localStorage, cobertura de projectManager. Use ao adicionar ou modificar testes.
---

# Testes

## Stack

- **Runner:** Vitest 3
- **DOM:** jsdom
- **Assertions:** `@testing-library/jest-dom` (setup em `src/test/setup.ts`)
- **Config:** `vitest.config.ts`

## Comandos

```bash
npm run test           # run once
npm run test:watch     # watch mode
npm run test:coverage  # com coverage v8
```

Testes rodam como parte de `npm run validate`.

## Estrutura

```
src/
├── utils/
│   ├── projectManager.ts
│   └── projectManager.test.ts   # testes colocados junto ao módulo
└── test/
    └── setup.ts                 # jest-dom matchers
```

Convenção: arquivo `*.test.ts` ou `*.spec.ts` ao lado do código testado.

## Padrão para localStorage

```typescript
describe('projectManager', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => localStorage.clear());

    it('...', async () => {
        // test
    });
});
```

Sempre limpar storage entre testes que tocam `projectManager`.

## O que testar

### projectManager (cobertura existente)

| Cenário               | Verificação                           |
| --------------------- | ------------------------------------- |
| Primeiro acesso       | Demo criado com `isDemo: true`        |
| Criar projeto         | Nó `root`, ID único, lista atualizada |
| Ler por ID            | Retorna projeto correto               |
| Atualizar nodes/edges | Persiste e atualiza `updatedAt`       |
| Renomear              | Nome trimado, `updatedAt` atualizado  |
| Deletar               | Remove da lista                       |
| Deletar demo          | Lança erro                            |
| Export                | JSON válido com todos os projetos     |
| Import merge          | Adiciona apenas IDs novos             |
| Import replace        | Substitui mantendo demo               |

### O que NÃO testar

- Implementação interna de hooks React (a menos que extraídos para funções puras)
- Estilos CSS ou renderização visual
- Comportamento trivial (ex.: getter que só retorna valor)

## Padrão de escrita

```typescript
it('creates a new project with initial nodes', async () => {
    await getProjects(); // garante inicialização
    const created = await createProject('My Project');

    expect(created.name).toBe('My Project');
    expect(created.nodes[0].id).toBe('root');
});
```

- Descrições em inglês (consistente com código do projeto)
- Arrange → Act → Assert
- Usar `async/await` com funções do `projectManager`

## ESLint para testes

Arquivos `**/*.{test,spec}.{ts,tsx}` e `src/test/**` têm globals do Vitest configurados em `eslint.config.js`.

## Checklist ao adicionar testes

- [ ] `localStorage.clear()` no setup/teardown se usar storage
- [ ] Testa comportamento observável, não detalhes internos
- [ ] Casos de erro cobertos quando a função lança exceção
- [ ] `npm run test` passa
- [ ] Teste agrega valor real (não duplica asserções triviais)
