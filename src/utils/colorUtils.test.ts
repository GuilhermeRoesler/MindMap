import type { Edge } from '@xyflow/react';
import { CONNECTION_COLORS, getChildIndex, getConnectionColor } from './colorUtils';

const makeEdge = (overrides: Partial<Edge> & Pick<Edge, 'id' | 'source' | 'target'>): Edge =>
    ({
        type: 'default',
        ...overrides,
    }) as Edge;

describe('getConnectionColor', () => {
    it('returns the color at the given index', () => {
        expect(getConnectionColor(0)).toBe(CONNECTION_COLORS[0]);
        expect(getConnectionColor(3)).toBe(CONNECTION_COLORS[3]);
    });

    it('wraps around when index exceeds palette length', () => {
        expect(getConnectionColor(CONNECTION_COLORS.length)).toBe(CONNECTION_COLORS[0]);
        expect(getConnectionColor(CONNECTION_COLORS.length + 2)).toBe(CONNECTION_COLORS[2]);
    });
});

describe('getChildIndex', () => {
    const edges: Edge[] = [
        makeEdge({ id: 'b-edge', source: 'parent', target: 'child-b' }),
        makeEdge({ id: 'a-edge', source: 'parent', target: 'child-a' }),
        makeEdge({ id: 'other-edge', source: 'other', target: 'child-x' }),
    ];

    it('returns sorted index among siblings of the same parent', () => {
        expect(getChildIndex('parent', 'child-a', edges)).toBe(0);
        expect(getChildIndex('parent', 'child-b', edges)).toBe(1);
    });

    it('returns 0 when child is not found', () => {
        expect(getChildIndex('parent', 'missing', edges)).toBe(0);
    });

    it('filters by side when provided', () => {
        const sideEdges: Edge[] = [
            makeEdge({
                id: 'right-1',
                source: 'parent',
                target: 'child-right',
                targetHandle: 'left-target',
            }),
            makeEdge({
                id: 'left-1',
                source: 'parent',
                target: 'child-left',
                targetHandle: 'right-target',
            }),
        ];

        expect(getChildIndex('parent', 'child-right', sideEdges, 'right')).toBe(0);
        expect(getChildIndex('parent', 'child-left', sideEdges, 'left')).toBe(0);
    });
});
