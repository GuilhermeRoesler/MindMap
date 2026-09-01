import { useCallback, useState, useEffect } from 'react';
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
    ReactFlowProvider,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    type Connection,
    type Node,
    type NodeChange,
    type EdgeChange,
    SelectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { initialNodes } from '../data/nodes';
import { initialEdges } from '../data/edges';
import { useConnectionColors } from '../hooks/useConnectionColors';

import InteractiveNode from '../components/InteractiveNode';
import HeaderPanel from '../components/HeaderPanel';
import { useLayoutNodes } from '../hooks/useLayoutNodes';

const nodeTypes = {
    interactive: InteractiveNode,
}

const flowConfig = {
    selectionMode: SelectionMode.Partial,
    multiSelectionKeyCode: 'Shift',
};

function FlowContent({ onLogout }: { onLogout: () => void }) {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const { updateConnectionColors } = useConnectionColors();
    const { layoutNodes } = useLayoutNodes();

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => {
                const updatedNodes = applyNodeChanges(changes, nds);
                localStorage.setItem('nodes', JSON.stringify(updatedNodes));
                return updatedNodes;
            })
        },
        []
    );

    const onNodesDelete = useCallback(
        (_: Node[]) => {
            setTimeout(() => {
                layoutNodes();
            }, 100);
        },
        [layoutNodes]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges((eds) => {
                const updatedEdges = applyEdgeChanges(changes, eds)
                localStorage.setItem('edges', JSON.stringify(updatedEdges));
                return updatedEdges;
            })
        },
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => {
                const updatedEdges = addEdge(connection, eds);
                localStorage.setItem('edges', JSON.stringify(updatedEdges));
                return updatedEdges;
            })
        },
        []
    );

    useEffect(() => {
        const storedNodes = localStorage.getItem('nodes');
        const storedEdges = localStorage.getItem('edges');

        if (storedNodes) {
            setNodes(JSON.parse(storedNodes));
        }
        if (storedEdges) {
            setEdges(JSON.parse(storedEdges));
        }
    }, []);

    useEffect(() => {
        if (edges.length > 0) {
            updateConnectionColors();
        }
    }, [edges.length, updateConnectionColors]);

    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-left"
                deleteKeyCode={null}
                {...flowConfig}
            />
            <Controls />
            <Background
                variant={BackgroundVariant.Lines}
                bgColor='#f2f2f2'
                lineWidth={1} color='#e6e6e6'
                gap={40} />
            <HeaderPanel onLogout={onLogout} />
        </>
    );
}

function MindMap({ onLogout }: { onLogout: () => void }) {
    return (
        <ReactFlowProvider>
            <FlowContent onLogout={onLogout} />
        </ReactFlowProvider>
    )
}

export default MindMap;