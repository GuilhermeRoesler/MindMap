// import React from 'react';
import { Search, Home, Plus } from 'lucide-react';

const Sidebar = () => {
    // Mock user data
    const userName = "Guilherme";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="user-info">
                    <div className="user-avatar">{userInitial}</div>
                    <span className="user-name">{userName}</span>
                </div>
                <button className="add-space-btn">
                    <Plus size={20} />
                </button>
            </div>
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search by title or topic" />
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className="active">
                        <a href="#">
                            <Home size={20} />
                            <span>Home</span>
                        </a>
                    </li>
                    {/* <li>
                        <a href="#">
                            <Clock size={20} />
                            <span>Recent</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <Star size={20} />
                            <span>Starred</span>
                        </a>
                    </li> */}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;