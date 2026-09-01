import { type Node, type Edge } from '@xyflow/react';
import { getConnectionColor } from '../utils/colorUtils';

export const DEMO_PROJECT_ID = 'demo';

const createEdge = (
    id: string,
    source: string,
    target: string,
    direction: 'right' | 'left',
    childIndex: number,
): Edge => {
    const color = getConnectionColor(childIndex);
    return {
        id,
        source,
        target,
        sourceHandle: direction === 'right' ? 'right' : 'left',
        targetHandle: direction === 'right' ? 'left-target' : 'right-target',
        style: { stroke: color, strokeWidth: 2 },
        data: { color, childIndex },
    };
};

export const demoNodes: Node[] = [
    {
        id: 'demo-root',
        type: 'interactive',
        data: { label: 'MindMap Demo' },
        position: { x: 0, y: 0 },
        deletable: false,
    },
    {
        id: 'demo-editing',
        type: 'interactive',
        data: { label: 'Interactive editing', parentId: 'demo-root', side: 'right' },
        position: { x: 200, y: -80 },
    },
    {
        id: 'demo-layout',
        type: 'interactive',
        data: { label: 'Auto layout (Dagre)', parentId: 'demo-root', side: 'right' },
        position: { x: 200, y: -20 },
    },
    {
        id: 'demo-colors',
        type: 'interactive',
        data: { label: 'Color-coded connections', parentId: 'demo-root', side: 'right' },
        position: { x: 200, y: 40 },
    },
    {
        id: 'demo-theme',
        type: 'interactive',
        data: { label: 'Dark & light theme', parentId: 'demo-root', side: 'right' },
        position: { x: 200, y: 100 },
    },
    {
        id: 'demo-storage',
        type: 'interactive',
        data: { label: 'Local storage — no backend', parentId: 'demo-root', side: 'right' },
        position: { x: 200, y: 160 },
    },
    {
        id: 'demo-tab',
        type: 'interactive',
        data: { label: 'Tab → child node', parentId: 'demo-editing', side: 'right' },
        position: { x: 420, y: -100 },
    },
    {
        id: 'demo-enter',
        type: 'interactive',
        data: { label: 'Enter → sibling node', parentId: 'demo-editing', side: 'right' },
        position: { x: 420, y: -60 },
    },
    {
        id: 'demo-projects',
        type: 'interactive',
        data: { label: 'Multiple projects', parentId: 'demo-storage', side: 'right' },
        position: { x: 420, y: 140 },
    },
    {
        id: 'demo-autosave',
        type: 'interactive',
        data: { label: 'Auto-save on edit', parentId: 'demo-storage', side: 'right' },
        position: { x: 420, y: 180 },
    },
];

export const demoEdges: Edge[] = [
    createEdge('demo-e-root-editing', 'demo-root', 'demo-editing', 'right', 0),
    createEdge('demo-e-root-layout', 'demo-root', 'demo-layout', 'right', 1),
    createEdge('demo-e-root-colors', 'demo-root', 'demo-colors', 'right', 2),
    createEdge('demo-e-root-theme', 'demo-root', 'demo-theme', 'right', 3),
    createEdge('demo-e-root-storage', 'demo-root', 'demo-storage', 'right', 4),
    createEdge('demo-e-editing-tab', 'demo-editing', 'demo-tab', 'right', 0),
    createEdge('demo-e-editing-enter', 'demo-editing', 'demo-enter', 'right', 1),
    createEdge('demo-e-storage-projects', 'demo-storage', 'demo-projects', 'right', 0),
    createEdge('demo-e-storage-autosave', 'demo-storage', 'demo-autosave', 'right', 1),
];

export const DEMO_PROJECT_NAME = 'Demo Mind Map';
