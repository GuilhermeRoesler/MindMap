import { useState, useEffect } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
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
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MindMapIcon from '@/icons/MindMapIcon';
import CreateProjectModal from '@/components/CreateProjectModal';
import DashboardHero from '@/components/DashboardHero';
import RenameProjectModal from '@/components/RenameProjectModal';
import ConfirmModal from '@/components/ConfirmModal';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex h-screen w-screen bg-background">
            <Sidebar onExport={handleExport} onImport={handleImportFile} />
            <main className="flex flex-1 flex-col overflow-y-auto">
                <Header />
                <div className="flex-1 px-10 py-6">
                    <DashboardHero
                        onTryDemo={() => onSelectProject(DEMO_PROJECT_ID)}
                        onCreateNew={() => setIsModalOpen(true)}
                    />

                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Your mind maps</h2>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus />
                            Create new
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-[1fr_auto_auto] items-center border-b px-6 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                <div>Name</div>
                                <div className="hidden w-32 sm:block">Last opened</div>
                                <div className="w-20" />
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center gap-4 py-12 text-muted-foreground">
                                    <Loader2 className="size-8 animate-spin text-primary" />
                                    <p>Loading your mind maps...</p>
                                </div>
                            ) : projects.length > 0 ? (
                                <div>
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="grid cursor-pointer grid-cols-[1fr_auto_auto] items-center border-b px-6 py-4 transition-colors last:border-b-0 hover:bg-muted/50"
                                            onClick={() => onSelectProject(project.id)}
                                        >
                                            <div className="flex min-w-0 items-center gap-4">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <MindMapIcon size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 font-semibold">
                                                        <span className="truncate">
                                                            {project.name}
                                                        </span>
                                                        {project.isDemo && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="shrink-0"
                                                            >
                                                                Demo
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Modified {formatDate(project.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="hidden w-32 text-sm text-muted-foreground sm:block">
                                                {formatDate(project.updatedAt)}
                                            </div>
                                            <div className="flex w-20 justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    title="Rename"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (project.isDemo) {
                                                            showToast(
                                                                'The demo project cannot be renamed.',
                                                                'info',
                                                            );
                                                            return;
                                                        }
                                                        setRenameTarget(project);
                                                    }}
                                                >
                                                    <Pencil />
                                                </Button>
                                                {!project.isDemo && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        title="Delete"
                                                        className="hover:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteTarget(project);
                                                        }}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <h3 className="mb-1 text-lg font-medium text-foreground">
                                        No mind maps yet.
                                    </h3>
                                    <p>Use the &quot;Create new&quot; button to start one.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <CreateProjectModal
                key={isModalOpen ? 'open' : 'closed'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateProject}
            />

            <RenameProjectModal
                key={renameTarget?.id ?? 'closed'}
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
