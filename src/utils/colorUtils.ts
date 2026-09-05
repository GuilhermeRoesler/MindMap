import type { Edge } from '@xyflow/react';

export const CONNECTION_COLORS = [
    '#0F766E',
    '#F59E0B',
    '#E11D48',
    '#2563EB',
    '#DB2777',
    '#EA580C',
    '#7C3AED',
    '#0891B2',
    '#65A30D',
    '#CA8A04',
    '#14B8A6',
    '#0D9488',
] as const;

export const getConnectionColor = (childIndex: number): string => {
    return CONNECTION_COLORS[childIndex % CONNECTION_COLORS.length];
};

export const getChildIndex = (
    parentId: string,
    childId: string,
    edges: Edge[],
    side?: 'left' | 'right',
): number => {
    let parentConnections = edges.filter((edge) => edge.source === parentId);

    // If a specific side is provided, filter only for that side
    if (side) {
        const expectedHandle = side === 'right' ? 'left-target' : 'right-target';
        parentConnections = parentConnections.filter(
            (edge) => edge.targetHandle === expectedHandle,
        );
    }

    parentConnections.sort((a, b) => {
        return a.id.localeCompare(b.id);
    });

    const childIndex = parentConnections.findIndex((edge) => edge.target === childId);
    return childIndex >= 0 ? childIndex : 0;
};
