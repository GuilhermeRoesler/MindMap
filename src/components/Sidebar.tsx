import { Home } from 'lucide-react';
import { getDisplayName, useGlobalConfigStore } from '../store/globalConfigStore';

const Sidebar = () => {
    const userEmail = useGlobalConfigStore(state => state.userEmail);
    const displayName = getDisplayName(userEmail);
    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="user-info">
                    <div className="user-avatar">{userInitial}</div>
                    <span className="user-name">{displayName}</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className="active">
                        <a href="#">
                            <Home size={20} />
                            <span>Home</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
