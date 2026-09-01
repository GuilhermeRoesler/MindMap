import { getDisplayName, useGlobalConfigStore } from '../store/globalConfigStore';

const Header = ({ onLogout }: { onLogout: () => void }) => {
    const userEmail = useGlobalConfigStore((state) => state.userEmail);
    const displayName = getDisplayName(userEmail);
    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <header className="main-header">
            <h1 className="logo">MindMap</h1>
            <div className="header-actions">
                <div className="user-avatar-header" onClick={onLogout} title="Logout">
                    {userInitial}
                </div>
            </div>
        </header>
    );
};

export default Header;
