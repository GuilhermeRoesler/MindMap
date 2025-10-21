import { useState, useEffect, useCallback } from "react";
import MindMap from "./pages/MindMap";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoadingSpinner from "./icons/LoadingSpinner";
import { useGlobalConfigStore } from "./store/globalConfigStore";

const App = () => {
    const [page, setPage] = useState('loading'); // 'loading', 'login', 'register', 'projects', 'mindmap'
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const { authToken, setAuthToken } = useGlobalConfigStore();

    useEffect(() => {
        if (authToken) {
            setPage('projects');
        } else {
            setPage('login');
        }
    }, [authToken]);

    const handleLoginSuccess = () => {
        setPage('projects');
    };

    const handleRegisterSuccess = () => {
        setPage('login');
    }

    const handleLogout = () => {
        setAuthToken(null);
        setPage('login');
    }

    const handleSelectProject = (projectId: string) => {
        setSelectedProjectId(projectId);
        setPage('mindmap');
    };

    const handleBackToProjects = useCallback(() => {
        setSelectedProjectId(null);
        setPage('projects');
    }, []);

    if (page === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <LoadingSpinner size="h-16 w-16" />
            </div>
        )
    }

    switch (page) {
        case 'register':
            return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={() => setPage('login')} />;
        case 'projects':
            return <ProjectsPage onSelectProject={handleSelectProject} onLogout={handleLogout} />;
        case 'mindmap':
            if (!selectedProjectId) {
                // Fallback in case there's no project ID
                return <ProjectsPage onSelectProject={handleSelectProject} onLogout={handleLogout} />;
            }
            return <MindMap projectId={selectedProjectId} onBackToProjects={handleBackToProjects} />;
        case 'login':
        default:
            return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setPage('register')} />;
    }
};

export default App;