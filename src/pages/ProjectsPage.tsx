import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Star, History } from 'lucide-react';
import { getProjects, createProject, deleteProject, type Project } from '../utils/projectManager';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface ProjectsPageProps {
    onSelectProject: (projectId: string) => void;
    onLogout: () => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject, onLogout }) => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        setProjects(getProjects());
    }, []);

    const handleCreateProject = () => {
        const name = prompt("Enter a name for your new mind map:");
        if (name && name.trim()) {
            const newProject = createProject(name.trim());
            // Navigate to the new project immediately
            onSelectProject(newProject.id);
        }
    };

    const handleDeleteProject = (id: string) => {
        if (window.confirm('Are you sure you want to delete this mind map?')) {
            deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        // Simple date format like "Jul 31"
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
                            <button onClick={handleCreateProject} className="create-new-btn">
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
                            {projects.length > 0 ? (
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
                                            <button className="action-btn" onClick={(e) => e.stopPropagation()}><Star size={16} /></button>
                                            <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>
                                                <MoreHorizontal size={16} />
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
        </div>
    );
};

export default ProjectsPage;