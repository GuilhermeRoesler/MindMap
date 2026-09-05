import { describe, expect, it } from 'vitest';
import type { Edge, Node } from '@xyflow/react';
import { buildThumbnailLayout, curvedPath } from './mapGeometry';

const nodes: Node[] = [
    {
        id: 'root',
        type: 'interactive',
        position: { x: 0, y: 0 },
        data: { label: 'Root' },
    },
    {
        id: 'child',
        type: 'interactive',
        position: { x: 200, y: 40 },
        data: { label: 'Child', parentId: 'root', side: 'right' },
    },
];

const edges: Edge[] = [
    {
        id: 'e1',
        source: 'root',
        target: 'child',
        style: { stroke: '#6F34DC' },
        data: { color: '#6F34DC' },
    },
];

describe('mapGeometry', () => {
    it('builds scaled thumbnail layout with nodes and edges', () => {
        const layout = buildThumbnailLayout(nodes, edges, 320, 180);
        expect(layout.nodes).toHaveLength(2);
        expect(layout.edges).toHaveLength(1);
        expect(layout.nodes[0]?.isRoot).toBe(true);
        expect(layout.edges[0]?.color).toBe('#6F34DC');
        expect(layout.nodes.every((n) => n.x >= 0 && n.y >= 0)).toBe(true);
    });

    it('returns empty layout when there are no nodes', () => {
        const layout = buildThumbnailLayout([], []);
        expect(layout.nodes).toEqual([]);
        expect(layout.edges).toEqual([]);
    });

    it('builds a cubic bezier path between points', () => {
        expect(curvedPath(0, 0, 100, 50)).toContain('C');
    });
});
