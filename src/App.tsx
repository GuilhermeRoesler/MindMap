import { useState, useCallback } from 'react';
import MindMap from './pages/MindMap';
import ProjectsPage from './pages/ProjectsPage';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './hooks/useTheme';
import { Toaster } from '@/components/ui/sonner';

type Page = 'projects' | 'mindmap';

const AppContent = () => {
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

const App = () => (
    <ThemeProvider>
        <ToastProvider>
            <AppContent />
            <Toaster position="bottom-right" richColors closeButton />
        </ToastProvider>
    </ThemeProvider>
);

export default App;
