import { memo, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { Handle, Position, useStore } from '@xyflow/react';

import AddButton from './AddButton';
import InteractiveNodeContent from './InteractiveNodeContent';
import useNodeHandler from '../hooks/useNodeHandler';
import { BRAND_COLOR } from '@/constants';

interface InteractiveNodeData {
    label: string;
    side: 'right' | 'left';
    parentId?: string;
    isEditing?: boolean;
}

function InteractiveNode({ id, data }: { id: string; data: InteractiveNodeData }) {
    const { createAdjacentNode, createSiblingNode, deleteNode } = useNodeHandler();
    const nodeRef = useRef<HTMLDivElement>(null);

    const accentColor = useStore((state) => {
        const edge = state.edges.find((e) => e.target === id);
        const fromData = (edge?.data as { color?: string } | undefined)?.color;
        if (typeof fromData === 'string') return fromData;
        if (typeof edge?.style?.stroke === 'string') return edge.style.stroke;
        return BRAND_COLOR;
    });

    const isRoot = !data.parentId;

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            e.stopPropagation();
            createAdjacentNode(id);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            createSiblingNode(id);
        } else if (e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            deleteNode(id);
        }
    };

    return (
        <div
            ref={nodeRef}
            id={id}
            className={`interactive-node${isRoot ? ' interactive-node--root' : ''}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ '--node-accent': accentColor } as CSSProperties}
        >
            <AddButton type="left" id={id} />
            <AddButton type="right" id={id} />
            <InteractiveNodeContent id={id} data={data} parentNodeRef={nodeRef} />
            <Handle type="source" position={Position.Left} id={'left'} />
            <Handle type="target" position={Position.Left} id={'left-target'} />
            <Handle type="source" position={Position.Right} id={'right'} />
            <Handle type="target" position={Position.Right} id={'right-target'} />
        </div>
    );
}

export default memo(InteractiveNode);
