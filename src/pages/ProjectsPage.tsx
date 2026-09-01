import React, { useState, useEffect } from 'react';
import { Plus, Trash2, History, Pencil } from 'lucide-react';
import {
    getProjects,
    createProject,
    deleteProject,
    renameProject,
    type Project,
} from '../utils/projectManager';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingSpinner from '../icons/LoadingSpinner';
import CreateProjectModal from '../components/CreateProjectModal';

interface ProjectsPageProps {
    onSelectProject: (projectId: string) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleCreateProject = async (name: string) => {
        const newProject = await createProject(name.trim());
        onSelectProject(newProject.id);
    };

    const handleDeleteProject = async (id: string, isDemo?: boolean) => {
        if (isDemo) {
            alert('The demo project cannot be deleted.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this mind map?')) {
            try {
                await deleteProject(id);
                setProjects((prev) => prev.filter((p) => p.id !== id));
            } catch (error) {
                alert('Failed to delete project. Please try again.');
                console.error(error);
            }
        }
    };

    const handleRenameProject = async (id: string, currentName: string, isDemo?: boolean) => {
        if (isDemo) {
            alert('The demo project name cannot be changed.');
            return;
        }
        const newName = window.prompt('Rename mind map:', currentName);
        if (!newName || newName.trim() === currentName) return;

        try {
            await renameProject(id, newName.trim());
            setProjects((prev) =>
                prev.map((p) => (p.id === id ? { ...p, name: newName.trim() } : p)),
            );
        } catch (error) {
            alert('Failed to rename project. Please try again.');
            console.error(error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="projects-layout">
            <Sidebar />
            <main className="main-content">
                <Header />
                <div className="projects-area">
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
                                                    handleRenameProject(
                                                        project.id,
                                                        project.name,
                                                        project.isDemo,
                                                    );
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
                                                        handleDeleteProject(
                                                            project.id,
                                                            project.isDemo,
                                                        );
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
        </div>
    );
};

export default ProjectsPage;
