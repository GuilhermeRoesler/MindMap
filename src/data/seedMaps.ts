import { type Node, type Edge } from '@xyflow/react';
import { createEdge, createNode } from './mapBuilders';
import { DEMO_PROJECT_ID, DEMO_PROJECT_NAME, demoNodes, demoEdges } from './demoProject';

export const SIDE_PROJECT_ID = 'sample-side-project';
export const WEEKLY_PLAN_ID = 'sample-weekly-plan';

export interface SeedProject {
    id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
    isDemo?: boolean;
}

const sideProjectNodes: Node[] = [
    createNode('side-root', 'Side project ideas', undefined, 0, 0, { deletable: false }),
    createNode('side-product', 'Product angle', 'side-root', 240, -90),
    createNode('side-tech', 'Tech stack', 'side-root', 240, 90),
    createNode('side-audience', 'Who is it for?', 'side-product', 500, -130),
    createNode('side-mvp', 'MVP scope', 'side-product', 500, -50),
    createNode('side-react', 'React + Vite', 'side-tech', 500, 50),
    createNode('side-local', 'Local-first storage', 'side-tech', 500, 130),
];

const sideProjectEdges: Edge[] = [
    createEdge('side-e-root-product', 'side-root', 'side-product', 'right', 0),
    createEdge('side-e-root-tech', 'side-root', 'side-tech', 'right', 1),
    createEdge('side-e-product-audience', 'side-product', 'side-audience', 'right', 0),
    createEdge('side-e-product-mvp', 'side-product', 'side-mvp', 'right', 1),
    createEdge('side-e-tech-react', 'side-tech', 'side-react', 'right', 0),
    createEdge('side-e-tech-local', 'side-tech', 'side-local', 'right', 1),
];

const weeklyNodes: Node[] = [
    createNode('week-root', 'This week', undefined, 0, 0, { deletable: false }),
    createNode('week-focus', 'Main focus', 'week-root', 240, -120),
    createNode('week-admin', 'Admin & errands', 'week-root', 240, 40),
    createNode('week-rest', 'Rest', 'week-root', 240, 180),
    createNode('week-ship', 'Ship portfolio polish', 'week-focus', 500, -160),
    createNode('week-read', 'Read 2 essays', 'week-focus', 500, -80),
    createNode('week-bills', 'Pay bills', 'week-admin', 500, 0),
    createNode('week-inbox', 'Clear inbox', 'week-admin', 500, 80),
    createNode('week-walk', 'Long walk', 'week-rest', 500, 180),
];

const weeklyEdges: Edge[] = [
    createEdge('week-e-root-focus', 'week-root', 'week-focus', 'right', 0),
    createEdge('week-e-root-admin', 'week-root', 'week-admin', 'right', 1),
    createEdge('week-e-root-rest', 'week-root', 'week-rest', 'right', 2),
    createEdge('week-e-focus-ship', 'week-focus', 'week-ship', 'right', 0),
    createEdge('week-e-focus-read', 'week-focus', 'week-read', 'right', 1),
    createEdge('week-e-admin-bills', 'week-admin', 'week-bills', 'right', 0),
    createEdge('week-e-admin-inbox', 'week-admin', 'week-inbox', 'right', 1),
    createEdge('week-e-rest-walk', 'week-rest', 'week-walk', 'right', 0),
];

/** Initial maps shown to first-time visitors (demo protected + 2 deletable samples). */
export const SEED_PROJECTS: SeedProject[] = [
    {
        id: DEMO_PROJECT_ID,
        name: DEMO_PROJECT_NAME,
        nodes: demoNodes,
        edges: demoEdges,
        isDemo: true,
    },
    {
        id: SIDE_PROJECT_ID,
        name: 'Side project ideas',
        nodes: sideProjectNodes,
        edges: sideProjectEdges,
    },
    {
        id: WEEKLY_PLAN_ID,
        name: 'Weekly plan',
        nodes: weeklyNodes,
        edges: weeklyEdges,
    },
];

export const SEED_PROJECT_IDS = new Set(SEED_PROJECTS.map((p) => p.id));
