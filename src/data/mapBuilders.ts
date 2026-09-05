import { type Node, type Edge } from '@xyflow/react';
import { getConnectionColor } from '../utils/colorUtils';

export const createEdge = (
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

export const createNode = (
    id: string,
    label: string,
    parentId: string | undefined,
    x: number,
    y: number,
    options?: { deletable?: boolean; side?: 'right' | 'left' },
): Node => ({
    id,
    type: 'interactive',
    data: {
        label,
        ...(parentId ? { parentId, side: options?.side ?? 'right' } : {}),
    },
    position: { x, y },
    ...(options?.deletable === false ? { deletable: false } : {}),
});
