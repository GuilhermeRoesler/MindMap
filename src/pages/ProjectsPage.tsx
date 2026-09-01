import React, { useState, useEffect } from 'react';
import { Plus, Trash2, History } from 'lucide-react';
import { getProjects, createProject, deleteProject, type Project } from '../utils/projectManager';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LoadingSpinner from '../icons/LoadingSpinner';
import CreateProjectModal from '../components/CreateProjectModal';

interface ProjectsPageProps {
    onSelectProject: (projectId: number) => void;
    onLogout: () => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject, onLogout }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            const fetchedProjects = await getProjects();
            setProjects(fetchedProjects);
            setIsLoading(false);
        };
        fetchProjects();
    }, []);

    const handleCreateProject = async (name: string) => {
        try {
            const newProject = await createProject(name.trim());
            onSelectProject(newProject.id);
        } catch (error) {
            console.error(error);
            throw error; // Re-throw to be caught and displayed by the modal
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this mind map?')) {
            try {
                await deleteProject(id);
                setProjects(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                alert('Failed to delete project. Please try again.');
                console.error(error);
            }
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
                <Header onLogout={onLogout} />
                <div className="projects-area">
                    <div className="projects-header">
                        <h2>Boards in this team</h2>
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
                                projects.map(project => (
                                    <div key={project.id} className="table-row" onClick={() => onSelectProject(project.id)}>
                                        <div className="col-name">
                                            <div className="project-icon">
                                                <History size={20} />
                                            </div>
                                            <div className="project-details">
                                                <span className="project-name">{project.name}</span>
                                                <span className="project-modified">
                                                    Modified {formatDate(project.updatedAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-last-opened">
                                            {formatDate(project.updatedAt)}
                                        </div>
                                        <div className="col-actions">
                                            <button className="action-btn group" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>
                                                <Trash2 size={16} className='group-hover:stroke-red-500 transition-all duration-300' />
                                            </button>
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
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateProject}
            />
        </div>
    );
};

export default ProjectsPage;