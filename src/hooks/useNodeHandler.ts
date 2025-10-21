import { useReactFlow, type Node } from '@xyflow/react';
import { useLayoutNodes } from './useLayoutNodes';
import { ulid } from 'ulid';
import { getConnectionColor } from '../utils/colorUtils';

const useNodeHandler = () => {
    const { getNode, getNodes, setNodes, getEdges, setEdges } = useReactFlow();
    const { layoutNodes } = useLayoutNodes();

    const createAdjacentNode = (id: string, direction: 'left' | 'right' = 'right') => {
        const currentNode = getNode(id);
        if (!currentNode) return;

        const offset = 50; // Distance between nodes
        const newPosition = {
            x: currentNode.position.x + (direction === 'right'
                ? offset + (currentNode.measured?.width || 0)
                : -offset - 98),
            y: (currentNode.measured?.height || 0) / 2 + currentNode.position.y - 16.5
        };

        const newNodeId = ulid();
        const newNode: Node = {
            id: newNodeId,
            data: {
                label: `Type something`,
                parentId: id,
                isEditing: true,
            },
            position: newPosition,
            type: 'interactive',
            style: {
                border: 'none',
            }
        };

        const currentEdges = getEdges();
        const childIndex = currentEdges.filter(edge => {
            const expectedHandle = direction === 'right' ? 'left-target' : 'right-target';
            return edge.source === id && edge.targetHandle === expectedHandle;
        }).length;
        const connectionColor = getConnectionColor(childIndex);

        const newEdge = {
            id: `edge-${id}-${newNodeId}`,
            source: id,
            target: newNodeId,
            sourceHandle: direction === 'right' ? 'right' : 'left',
            targetHandle: direction === 'right' ? 'left-target' : 'right-target',
            type: 'default',
            style: {
                stroke: connectionColor,
            },
            data: {
                color: connectionColor,
                childIndex: childIndex
            }
        };

        setNodes((nodes) => [...nodes, newNode]);
        setEdges((edges) => [...edges, newEdge]);

        setTimeout(() => {
            layoutNodes();

            const newNodeElement = document.getElementById(newNodeId);
            if (newNodeElement)
                newNodeElement.focus();
        }, 100);

    };

    const createSiblingNode = (id: string) => {
        const currentNode = getNode(id);
        if (!currentNode) return;

        const parentId = currentNode.data.parentId as string;
        if (parentId) {
            createAdjacentNode(parentId);
        }
    }

    const collectDescendantIds = (id: string, nodes: Node[]): string[] => {
        const children = nodes.filter(node => node.data.parentId === id);
        let ids = [id];
        children.forEach(child => {
            ids = ids.concat(collectDescendantIds(child.id, nodes));
        });
        return ids;
    };

    const deleteNode = (id: string) => {
        if (id === 'root') return; // Prevent deleting the root node

        const nodes = getNodes();
        const edges = getEdges();

        const idsToRemove = collectDescendantIds(id, nodes);

        setNodes(nodes.filter(node => !idsToRemove.includes(node.id)));
        setEdges(edges.filter(edge => !idsToRemove.includes(edge.source) && !idsToRemove.includes(edge.target)));

        setTimeout(() => {
            layoutNodes();
        }, 100);
    };

    return { createAdjacentNode, createSiblingNode, deleteNode };
};

export default useNodeHandler;