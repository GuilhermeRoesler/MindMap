import { useState, useCallback } from 'react';
import MindMap from './pages/MindMap';
import ProjectsPage from './pages/ProjectsPage';

type Page = 'projects' | 'mindmap';

const App = () => {
    const [page, setPage] = useState<Page>('projects');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const handleSelectProject = (projectId: string) => {
        setSelectedProjectId(projectId);
        setPage('mindmap');
    };

    const handleBackToProjects = useCallback(() => {
        setSelectedProjectId(null);
        setPage('projects');
    }, []);

    if (page === 'mindmap' && selectedProjectId) {
        return <MindMap projectId={selectedProjectId} onBackToProjects={handleBackToProjects} />;
    }

    return <ProjectsPage onSelectProject={handleSelectProject} />;
};

export default App;
