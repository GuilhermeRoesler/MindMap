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
    useReactFlow,
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
import { exportFlowToPng } from '../utils/exportImage';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import OnboardingBanner from '../components/OnboardingBanner';
import FirstBranchHint from '../components/FirstBranchHint';
import { ShortcutsDock } from '../components/ShortcutsPanel';
import { ONBOARDING_KEY } from '../constants';
import { useToast } from '../context/ToastContext';

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
    const [projectName, setProjectName] = useState('Mind map');
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [isExporting, setIsExporting] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [flowEnter, setFlowEnter] = useState(true);
    const { updateConnectionColors } = useConnectionColors();
    const { layoutNodes } = useLayoutNodes();
    const { fitView } = useReactFlow();
    const isSavingRef = useRef(false);
    const isInitialLoad = useRef(true);
    const hasFittedRef = useRef(false);
    const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const [shortcutsOpen, setShortcutsOpen] = useState(false);

    const saveData = useCallback(async () => {
        if (isSavingRef.current || nodes === null || edges === null) return;

        isSavingRef.current = true;
        setSaveStatus('saving');
        try {
            await updateProjectData(projectId, nodes, edges);
            setSaveStatus('saved');
            if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
            savedTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2200);
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
            hasFittedRef.current = false;
            setFlowEnter(true);
            setShowOnboarding(false);
            const project = await getProject(projectId);
            if (project) {
                setNodes(project.nodes);
                setEdges(project.edges);
                setProjectName(project.name);
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

    // Fit the full map into view once nodes are ready — portfolio "wow" shot
    useEffect(() => {
        if (!nodes || hasFittedRef.current) return;

        const fit = () => {
            fitView({ padding: 0.22, duration: 700, maxZoom: 1.2, minZoom: 0.35 });
            hasFittedRef.current = true;
        };

        const t1 = window.setTimeout(fit, 60);
        const t2 = window.setTimeout(fit, 280);
        const clearEnter = window.setTimeout(() => setFlowEnter(false), 1400);

        return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.clearTimeout(clearEnter);
        };
    }, [nodes, fitView]);

    // Onboarding arrives after the map is the hero
    useEffect(() => {
        if (!nodes || localStorage.getItem(ONBOARDING_KEY)) return;

        const t = window.setTimeout(() => setShowOnboarding(true), 1200);
        return () => window.clearTimeout(t);
    }, [nodes, projectId]);

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

    const handleExportPng = async () => {
        if (!nodes) return;
        setIsExporting(true);
        document.documentElement.classList.add('exporting-png');
        try {
            // Reframe tightly before capture
            fitView({ padding: 0.18, duration: 0, maxZoom: 1.35 });
            await new Promise((r) => setTimeout(r, 80));
            await exportFlowToPng(projectName, nodes);
            showToast('PNG exported.', 'success');
        } catch {
            showToast('Failed to export PNG.', 'error');
        } finally {
            document.documentElement.classList.remove('exporting-png');
            setIsExporting(false);
        }
    };

    if (nodes === null || edges === null) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-background">
                <Loader2 className="size-12 animate-spin text-primary" />
            </div>
        );
    }

    const showFirstBranchHint = nodes.length === 1 && !showOnboarding;

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
                fitViewOptions={{ padding: 0.22, maxZoom: 1.2 }}
                deleteKeyCode={null}
                proOptions={{ hideAttribution: true }}
                className={flowEnter ? 'flow-enter flow-enter--initial' : 'flow-enter'}
                {...flowConfig}
            >
                <Controls showInteractive={false} />
                <Background
                    variant={BackgroundVariant.Dots}
                    bgColor={isDark ? '#12131c' : '#eef1f8'}
                    color={isDark ? '#2a2d3d' : '#c8d0e4'}
                    gap={22}
                    size={1.5}
                />
            </ReactFlow>
            {showOnboarding && (
                <OnboardingBanner
                    onDismiss={dismissOnboarding}
                    onOpenShortcuts={() => setShortcutsOpen(true)}
                />
            )}
            <FirstBranchHint visible={showFirstBranchHint} />
            <ShortcutsDock open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
            <HeaderPanel
                onBack={onBackToProjects}
                saveStatus={saveStatus}
                projectName={projectName}
                nodeCount={nodes.length}
                onExportPng={() => void handleExportPng()}
                isExporting={isExporting}
                onOpenShortcuts={() => setShortcutsOpen(true)}
            />
        </>
    );
}

interface MindMapProps {
    projectId: string;
    onBackToProjects: () => void;
}

function MindMap({ projectId, onBackToProjects }: MindMapProps) {
    return (
        <div className="app-container page-enter">
            <ReactFlowProvider>
                <FlowContent projectId={projectId} onBackToProjects={onBackToProjects} />
            </ReactFlowProvider>
        </div>
    );
}

export default MindMap;
