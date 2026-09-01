import React, { useState, useEffect } from 'react';
import { Plus, Trash2, History, Pencil } from 'lucide-react';
import {
    getProjects,
    createProject,
    deleteProject,
    renameProject,
    exportProjects,
    importProjects,
    type Project,
} from '../utils/projectManager';
import { DEMO_PROJECT_ID } from '../data/demoProject';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingSpinner from '../icons/LoadingSpinner';
import CreateProjectModal from '../components/CreateProjectModal';
import DashboardHero from '../components/DashboardHero';
import RenameProjectModal from '../components/RenameProjectModal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

interface ProjectsPageProps {
    onSelectProject: (projectId: string) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
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
        <div className="projects-layout">
            <Sidebar onExport={handleExport} onImport={handleImportFile} />
            <main className="main-content">
                <Header />
                <div className="projects-area">
                    <DashboardHero
                        onTryDemo={() => onSelectProject(DEMO_PROJECT_ID)}
                        onCreateNew={() => setIsModalOpen(true)}
                    />
                    <div className="projects-header">
                        <h2>Your mind maps</h2>
                        <div className="projects-header-actions">
                            <button onClick={() => setIsModalOpen(true)} className="create-new-btn">
                                <Plus size={16} /> Create new
                            </button>
                        </div>
                    </div>
                    <div className="projects-table">
                        <div className="table-header">
                            <div className="col-name">Name</div>
                            <div className="col-last-opened">Last opened</div>
                            <div className="col-actions"></div>
                        </div>
                        <div className="table-body">
                            {isLoading ? (
                                <div className="loading-state">
                                    <LoadingSpinner />
                                    <p>Loading your mind maps...</p>
                                </div>
                            ) : projects.length > 0 ? (
                                projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="table-row"
                                        onClick={() => onSelectProject(project.id)}
                                    >
                                        <div className="col-name">
                                            <div className="project-icon">
                                                <History size={20} />
                                            </div>
                                            <div className="project-details">
                                                <span className="project-name">
                                                    {project.name}
                                                    {project.isDemo && (
                                                        <span className="demo-badge">Demo</span>
                                                    )}
                                                </span>
                                                <span className="project-modified">
                                                    Modified {formatDate(project.updatedAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-last-opened">
                                            {formatDate(project.updatedAt)}
                                        </div>
                                        <div className="col-actions">
                                            <button
                                                className="action-btn group"
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
                                                <Pencil
                                                    size={16}
                                                    className="group-hover:stroke-blue-500 transition-all duration-300"
                                                />
                                            </button>
                                            {!project.isDemo && (
                                                <button
                                                    className="action-btn group"
                                                    title="Delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteTarget(project);
                                                    }}
                                                >
                                                    <Trash2
                                                        size={16}
                                                        className="group-hover:stroke-red-500 transition-all duration-300"
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <h3>No mind maps yet.</h3>
                                    <p>Use the "Create new" button to start one.</p>
                                </div>
                            )}
                        </div>
                    </div>
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

            {pendingImportFile && (
                <div className="modal-overlay" onClick={() => setPendingImportFile(null)}>
                    <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Import backup</h2>
                        <p className="modal-description">
                            Choose how to import <strong>{pendingImportFile.name}</strong>.
                        </p>
                        <div className="modal-actions modal-actions-stack">
                            <button
                                type="button"
                                className="btn-brand"
                                onClick={() => void handleImportConfirm('merge')}
                            >
                                Merge — add new projects only
                            </button>
                            <button
                                type="button"
                                className="btn-danger"
                                onClick={() => void handleImportConfirm('replace')}
                            >
                                Replace — restore full backup
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setPendingImportFile(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
