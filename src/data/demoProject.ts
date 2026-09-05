import { type Node, type Edge } from '@xyflow/react';
import { createEdge, createNode } from './mapBuilders';

export const DEMO_PROJECT_ID = 'demo';
export const DEMO_PROJECT_NAME = 'Learning Roadmap';

export const demoNodes: Node[] = [
    createNode('demo-root', 'Learning Roadmap', undefined, 0, 0, { deletable: false }),
    createNode('demo-frontend', 'Frontend craft', 'demo-root', 240, -150),
    createNode('demo-systems', 'Systems thinking', 'demo-root', 240, 20),
    createNode('demo-ship', 'Shipping habits', 'demo-root', 240, 170),
    createNode('demo-react', 'React patterns', 'demo-frontend', 500, -220),
    createNode('demo-a11y', 'Accessibility', 'demo-frontend', 500, -150),
    createNode('demo-motion', 'Motion & polish', 'demo-frontend', 500, -80),
    createNode('demo-apis', 'API design', 'demo-systems', 500, -10),
    createNode('demo-data', 'Data modeling', 'demo-systems', 500, 60),
    createNode('demo-focus', 'Deep work blocks', 'demo-ship', 500, 140),
    createNode('demo-review', 'Weekly review', 'demo-ship', 500, 210),
];

export const demoEdges: Edge[] = [
    createEdge('demo-e-root-frontend', 'demo-root', 'demo-frontend', 'right', 0),
    createEdge('demo-e-root-systems', 'demo-root', 'demo-systems', 'right', 1),
    createEdge('demo-e-root-ship', 'demo-root', 'demo-ship', 'right', 2),
    createEdge('demo-e-frontend-react', 'demo-frontend', 'demo-react', 'right', 0),
    createEdge('demo-e-frontend-a11y', 'demo-frontend', 'demo-a11y', 'right', 1),
    createEdge('demo-e-frontend-motion', 'demo-frontend', 'demo-motion', 'right', 2),
    createEdge('demo-e-systems-apis', 'demo-systems', 'demo-apis', 'right', 0),
    createEdge('demo-e-systems-data', 'demo-systems', 'demo-data', 'right', 1),
    createEdge('demo-e-ship-focus', 'demo-ship', 'demo-focus', 'right', 0),
    createEdge('demo-e-ship-review', 'demo-ship', 'demo-review', 'right', 1),
];
