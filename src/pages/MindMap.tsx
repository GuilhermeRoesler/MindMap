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
import HeaderPanel, { type SaveStatus } from '../components/HeaderPanel';
import { useLayoutNodes } from '../hooks/useLayoutNodes';
import { getProject, updateProjectData } from '../utils/projectManager';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import OnboardingBanner from '../components/OnboardingBanner';
import { ONBOARDING_KEY } from '../constants';

const nodeTypes = {
    interactive: InteractiveNode,
};

const flowConfig = {
    selectionMode: SelectionMode.Partial,
    multiSelectionKeyCode: 'Shift',
};

interface FlowContentProps {
    projectId: string;
    onBackToProjects: () => void;
}

function FlowContent({ projectId, onBackToProjects }: FlowContentProps) {
    const [nodes, setNodes] = useState<Node[] | null>(null);
    const [edges, setEdges] = useState<Edge[] | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [showOnboarding, setShowOnboarding] = useState(
        () => !localStorage.getItem(ONBOARDING_KEY),
    );
    const { updateConnectionColors } = useConnectionColors();
    const { layoutNodes } = useLayoutNodes();
    const isSavingRef = useRef(false);
    const isInitialLoad = useRef(true);
    const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isDark } = useTheme();

    const saveData = useCallback(async () => {
        if (isSavingRef.current || nodes === null || edges === null) return;

        isSavingRef.current = true;
        setSaveStatus('saving');
        try {
            await updateProjectData(projectId, nodes, edges);
            setSaveStatus('saved');
            if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
            savedTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Failed to save project:', error);
            setSaveStatus('idle');
        } finally {
            setTimeout(() => {
                isSavingRef.current = false;
            }, 500);
        }
    }, [projectId, nodes, edges]);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds!));
    }, []);

    const onNodesDelete = useCallback(() => {
        setTimeout(() => {
            layoutNodes();
        }, 100);
    }, [layoutNodes]);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds!));
    }, []);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge(connection, eds!));
    }, []);

    useEffect(() => {
        const loadProjectData = async () => {
            isInitialLoad.current = true;
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

    useEffect(() => {
        if (nodes === null || edges === null) return;
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        saveData();
    }, [nodes, edges, saveData]);

    useEffect(() => {
        return () => {
            if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
        };
    }, []);

    const edgeStructureSignature = useMemo(() => {
        if (!edges) return '';
        return edges
            .map((e) => `${e.source}-${e.target}-${e.sourceHandle}-${e.targetHandle}`)
            .sort()
            .join(',');
    }, [edges]);

    useEffect(() => {
        if (edges && edges.length > 0) {
            updateConnectionColors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- edgeStructureSignature replaces edges to avoid update loops
    }, [edgeStructureSignature, updateConnectionColors]);

    const dismissOnboarding = () => {
        localStorage.setItem(ONBOARDING_KEY, '1');
        setShowOnboarding(false);
    };

    if (nodes === null || edges === null) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-background">
                <Loader2 className="size-12 animate-spin text-primary" />
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
                deleteKeyCode={null}
                proOptions={{ hideAttribution: true }}
                {...flowConfig}
            >
                <Controls />
                <Background
                    variant={BackgroundVariant.Dots}
                    bgColor={isDark ? '#12131c' : '#f3f5fb'}
                    color={isDark ? '#2a2d3d' : '#d5dae8'}
                    gap={22}
                    size={1.5}
                />
            </ReactFlow>
            {showOnboarding && <OnboardingBanner onDismiss={dismissOnboarding} />}
            <HeaderPanel onBack={onBackToProjects} saveStatus={saveStatus} />
        </>
    );
}

interface MindMapProps {
    projectId: string;
    onBackToProjects: () => void;
}

function MindMap({ projectId, onBackToProjects }: MindMapProps) {
    return (
        <div className="app-container">
            <ReactFlowProvider>
                <FlowContent projectId={projectId} onBackToProjects={onBackToProjects} />
            </ReactFlowProvider>
        </div>
    );
}

export default MindMap;
