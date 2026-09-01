// import React from 'react';

const Header = ({ onLogout }: { onLogout: () => void }) => {
    const userName = "Guilherme";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="main-header">
            <h1 className="logo">MindMap</h1>
            <div className="header-actions">
                <div className="user-avatar-header" onClick={onLogout} title="Logout">{userInitial}</div>
            </div>
        </header>
    );
};

export default Header;