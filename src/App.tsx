import { useState, useEffect } from "react";
import MindMap from "./pages/MindMap";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LoadingSpinner from "./icons/LoadingSpinner";
import { useGlobalConfigStore } from "./store/globalConfigStore";

const App = () => {
    const [page, setPage] = useState('loading'); // 'loading', 'login', 'register', 'mindmap'
    const { authToken, setAuthToken } = useGlobalConfigStore();

    useEffect(() => {
        if (authToken) {
            setPage('mindmap');
        } else {
            setPage('login');
        }
    }, [authToken]);

    const handleLoginSuccess = () => {
        setPage('mindmap');
    };

    const handleRegisterSuccess = () => {
        setPage('login');
    }

    const handleLogout = () => {
        setAuthToken(null);
        setPage('login');
    }

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
        case 'mindmap':
            return <MindMap onLogout={handleLogout} />;
        case 'login':
        default:
            return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setPage('register')} />;
    }
};

export default App;