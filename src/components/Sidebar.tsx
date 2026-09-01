import { Home, Sparkles } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="user-info">
                    <div className="user-avatar">
                        <Sparkles size={18} />
                    </div>
                    <span className="user-name">MindMap</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className="active">
                        <a href="#">
                            <Home size={20} />
                            <span>Dashboard</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
