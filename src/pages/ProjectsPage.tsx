import React, { useState, useEffect } from 'react';
import { History, Plus, Trash2 } from 'lucide-react';
import { getProjects, createProject, deleteProject, Project } from '../utils/projectManager';

interface ProjectsPageProps {
    onSelectProject: (projectId: string) => void;
    onLogout: () => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject, onLogout }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState('');

    useEffect(() => {
        setProjects(getProjects());
    }, []);

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            const newProject = createProject(newProjectName.trim());
            setProjects(prev => [newProject, ...prev]);
            setNewProjectName('');
            onSelectProject(newProject.id);
        }
    };

    const handleDeleteProject = (id: string) => {
        if (window.confirm('Are you sure you want to delete this mind map?')) {
            deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                            <History className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Your Mind Maps</h1>
                            <p className="text-gray-500">Select a project or create a new one.</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="bg-white text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg shadow-sm border border-gray-200 transition">
                        Logout
                    </button>
                </header>

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Mind Map</h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                            placeholder="Enter a name for your new mind map..."
                            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                        <button
                            onClick={handleCreateProject}
                            className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 flex items-center gap-2"
                        >
                            <Plus size={20} /> Create
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {projects.length > 0 ? (
                        projects.map(project => (
                            <div key={project.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center transition-all hover:shadow-lg hover:scale-[1.02]">
                                <div onClick={() => onSelectProject(project.id)} className="cursor-pointer flex-grow">
                                    <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Last updated: {new Date(project.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                                <button onClick={() => handleDeleteProject(project.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl text-gray-600">No mind maps yet.</h3>
                            <p className="text-gray-400 mt-2">Use the form above to create your first one!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;