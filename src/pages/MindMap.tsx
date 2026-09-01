import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
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
    type Edge,
    type NodeChange,
    type EdgeChange,
    SelectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useConnectionColors } from '../hooks/useConnectionColors';
import InteractiveNode from '../components/InteractiveNode';
import HeaderPanel from '../components/HeaderPanel';
import { useLayoutNodes } from '../hooks/useLayoutNodes';
import { getProject, saveProject } from '../utils/projectManager';
import LoadingSpinner from '../icons/LoadingSpinner';
import { useThemeDetector } from '../hooks/useThemeDetector';

const nodeTypes = {
    interactive: InteractiveNode,
}

const flowConfig = {
    selectionMode: SelectionMode.Partial,
    multiSelectionKeyCode: 'Shift',
};

interface FlowContentProps {
    projectId: number;
    onBackToProjects: () => void;
}

function FlowContent({ projectId, onBackToProjects }: FlowContentProps) {
    const [nodes, setNodes] = useState<Node[] | null>(null);
    const [edges, setEdges] = useState<Edge[] | null>(null);
    const { updateConnectionColors } = useConnectionColors();
    const { layoutNodes } = useLayoutNodes();
    const isSavingRef = useRef(false);
    const isDarkTheme = useThemeDetector();

    const saveData = useCallback(async () => {
        if (isSavingRef.current || nodes === null || edges === null) return;

        const project = await getProject(projectId);
        if (project) {
            isSavingRef.current = true;
            try {
                await saveProject({ ...project, nodes, edges });
            } catch (error) {
                console.error("Failed to save project:", error);
                // Optionally, show a toast notification to the user
            } finally {
                setTimeout(() => {
                    isSavingRef.current = false;
                }, 500); // Debounce saving
            }
        }
    }, [projectId, nodes, edges]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => applyNodeChanges(changes, nds!));
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
            setEdges((eds) => applyEdgeChanges(changes, eds!));
        },
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge(connection, eds!));
        },
        []
    );

    // Load project data on mount
    useEffect(() => {
        const loadProjectData = async () => {
            const project = await getProject(projectId);
            if (project) {
                setNodes(project.nodes);
                setEdges(project.edges);
            } else {
                console.error(`Project with id ${projectId} not found.`);
                onBackToProjects();
            }
        };
        loadProjectData();
    }, [projectId, onBackToProjects]);

    // Save data when nodes or edges change
    useEffect(() => {
        if (nodes !== null && edges !== null) {
            saveData();
        }
    }, [nodes, edges, saveData]);

    const edgeStructureSignature = useMemo(() => {
        if (!edges) return '';
        // Create a unique signature for the graph structure.
        // This prevents the color update from running in a loop.
        return edges.map(e => `${e.source}-${e.target}-${e.sourceHandle}-${e.targetHandle}`).sort().join(',');
    }, [edges]);

    useEffect(() => {
        if (edges && edges.length > 0) {
            updateConnectionColors();
        }
    }, [edgeStructureSignature, updateConnectionColors]);

    if (nodes === null || edges === null) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-gray-50">
                <LoadingSpinner size="h-12 w-12" />
            </div>
        );
    }

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
            >
                <Controls />
                <Background
                    variant={BackgroundVariant.Lines}
                    bgColor={isDarkTheme ? '#1a1a1a' : '#f8f9fa'}
                    lineWidth={1}
                    color={isDarkTheme ? '#141414' : '#e9ecef'}
                    gap={40} />
            </ReactFlow>
            <HeaderPanel onBack={onBackToProjects} />
        </>
    );
}

interface MindMapProps {
    projectId: number;
    onBackToProjects: () => void;
}

function MindMap({ projectId, onBackToProjects }: MindMapProps) {
    return (
        <div className="app-container">
            <ReactFlowProvider>
                <FlowContent projectId={projectId} onBackToProjects={onBackToProjects} />
            </ReactFlowProvider>
        </div>
    )
}

export default MindMap;