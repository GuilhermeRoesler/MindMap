import { useState, useCallback } from 'react';
import MindMap from './pages/MindMap';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import { useGlobalConfigStore } from './store/globalConfigStore';

type Page = 'login' | 'register' | 'projects' | 'mindmap';

const App = () => {
    const { authToken, setAuthToken } = useGlobalConfigStore();
    const [page, setPage] = useState<Page>(() => (authToken ? 'projects' : 'login'));
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    const handleLoginSuccess = () => {
        setPage('projects');
    };

    const handleRegisterSuccess = () => {
        setPage('login');
    };

    const handleLogout = () => {
        setAuthToken(null);
        setPage('login');
    };

    const handleSelectProject = (projectId: number) => {
        setSelectedProjectId(projectId);
        setPage('mindmap');
    };

    const handleBackToProjects = useCallback(() => {
        setSelectedProjectId(null);
        setPage('projects');
    }, []);

    switch (page) {
        case 'register':
            return (
                <RegisterPage
                    onRegisterSuccess={handleRegisterSuccess}
                    onNavigateToLogin={() => setPage('login')}
                />
            );
        case 'projects':
            return <ProjectsPage onSelectProject={handleSelectProject} onLogout={handleLogout} />;
        case 'mindmap':
            if (!selectedProjectId) {
                return (
                    <ProjectsPage onSelectProject={handleSelectProject} onLogout={handleLogout} />
                );
            }
            return (
                <MindMap projectId={selectedProjectId} onBackToProjects={handleBackToProjects} />
            );
        case 'login':
        default:
            return (
                <LoginPage
                    onLoginSuccess={handleLoginSuccess}
                    onNavigateToRegister={() => setPage('register')}
                />
            );
    }
};

export default App;
