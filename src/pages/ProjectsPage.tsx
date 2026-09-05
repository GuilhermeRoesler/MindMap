import { useState, useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import {
    getProjects,
    createProject,
    deleteProject,
    renameProject,
    exportProjects,
    importProjects,
    type Project,
} from '@/utils/projectManager';
import { DEMO_PROJECT_ID } from '@/data/demoProject';
import { HERO_DISMISSED_KEY } from '@/constants';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CreateProjectModal from '@/components/CreateProjectModal';
import DashboardHero from '@/components/DashboardHero';
import ProjectCard from '@/components/ProjectCard';
import EmptyProjectsState from '@/components/EmptyProjectsState';
import { HoverGrid, HoverGridItem } from '@/components/ui/card-hover-effect';
import RenameProjectModal from '@/components/RenameProjectModal';
import ConfirmModal from '@/components/ConfirmModal';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectsPageProps {
    onSelectProject: (projectId: string) => void;
}

const ProjectsPage = ({ onSelectProject }: ProjectsPageProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState<Project | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);
    const [showHero, setShowHero] = useState(() => !localStorage.getItem(HERO_DISMISSED_KEY));
    const { showToast } = useToast();

    useEffect(() => {
        let cancelled = false;
        getProjects().then((fetchedProjects) => {
            if (!cancelled) {
                setProjects(fetchedProjects);
                setIsLoading(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const refreshProjects = async () => {
        const fetched = await getProjects();
        setProjects(fetched);
    };

    const handleCreateProject = async (name: string) => {
        const newProject = await createProject(name.trim());
        showToast('Mind map created!', 'success');
        onSelectProject(newProject.id);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteProject(deleteTarget.id);
            setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
            showToast('Mind map deleted.', 'success');
            setDeleteTarget(null);
        } catch {
            showToast('Failed to delete project.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRename = async (name: string) => {
        if (!renameTarget) return;
        await renameProject(renameTarget.id, name);
        setProjects((prev) => prev.map((p) => (p.id === renameTarget.id ? { ...p, name } : p)));
        showToast('Mind map renamed.', 'success');
    };

    const handleExport = () => {
        const json = exportProjects();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mindmap-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Backup exported.', 'success');
    };

    const handleImportFile = (file: File) => {
        setPendingImportFile(file);
    };

    const handleImportConfirm = async (mode: 'merge' | 'replace') => {
        if (!pendingImportFile) return;
        try {
            const text = await pendingImportFile.text();
            const count = await importProjects(text, mode);
            await refreshProjects();
            showToast(
                mode === 'merge'
                    ? `${count} project(s) imported.`
                    : `Backup restored (${count} projects).`,
                'success',
            );
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Import failed.', 'error');
        } finally {
            setPendingImportFile(null);
        }
    };

    const handleDismissHero = () => {
        localStorage.setItem(HERO_DISMISSED_KEY, '1');
        setShowHero(false);
    };

    return (
        <div className="dashboard-shell flex h-screen w-screen bg-background">
            <Sidebar onExport={handleExport} onImport={handleImportFile} />
            <main className="flex flex-1 flex-col overflow-y-auto">
                <Header />
                <div className="relative flex-1 px-6 py-8 sm:px-10">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_45%)]" />
                    <div className="relative mx-auto max-w-6xl">
                        {showHero && (
                            <DashboardHero
                                onTryDemo={() => onSelectProject(DEMO_PROJECT_ID)}
                                onCreateNew={() => setIsModalOpen(true)}
                                onDismiss={handleDismissHero}
                            />
                        )}

                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold tracking-tight">Your mind maps</h2>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus />
                                Create new
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-card/60 py-16 text-muted-foreground">
                                <Loader2 className="size-8 animate-spin text-primary" />
                                <p>Loading your mind maps...</p>
                            </div>
                        ) : projects.length > 0 ? (
                            <HoverGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {({ hoveredIndex, setHoveredIndex }) =>
                                    projects.map((project, index) => (
                                        <HoverGridItem
                                            key={project.id}
                                            index={index}
                                            hoveredIndex={hoveredIndex}
                                            setHoveredIndex={setHoveredIndex}
                                            className="p-1"
                                        >
                                            <ProjectCard
                                                project={project}
                                                index={index}
                                                onOpen={() => onSelectProject(project.id)}
                                                onRename={() => setRenameTarget(project)}
                                                onDelete={() => setDeleteTarget(project)}
                                                onRenameBlocked={() =>
                                                    showToast(
                                                        'The demo project cannot be renamed.',
                                                        'info',
                                                    )
                                                }
                                            />
                                        </HoverGridItem>
                                    ))
                                }
                            </HoverGrid>
                        ) : (
                            <EmptyProjectsState onCreate={() => setIsModalOpen(true)} />
                        )}
                    </div>
                </div>
            </main>

            <CreateProjectModal
                key={isModalOpen ? 'create-open' : 'create-closed'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateProject}
            />

            <RenameProjectModal
                key={renameTarget ? `rename-${renameTarget.id}` : 'rename-closed'}
                isOpen={!!renameTarget}
                currentName={renameTarget?.name ?? ''}
                onClose={() => setRenameTarget(null)}
                onRename={handleRename}
            />

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete mind map?"
                message={`"${deleteTarget?.name}" will be permanently removed. This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeleteTarget(null)}
            />

            <AlertDialog
                open={!!pendingImportFile}
                onOpenChange={(open) => !open && setPendingImportFile(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Import backup</AlertDialogTitle>
                        <AlertDialogDescription>
                            Choose how to import <strong>{pendingImportFile?.name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
                        <AlertDialogAction
                            className="w-full"
                            onClick={() => void handleImportConfirm('merge')}
                        >
                            Merge — add new projects only
                        </AlertDialogAction>
                        <AlertDialogAction
                            variant="destructive"
                            className="w-full"
                            onClick={() => void handleImportConfirm('replace')}
                        >
                            Replace — restore full backup
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectsPage;
