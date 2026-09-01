import { useRef } from 'react';
import { Home, Download, Upload, Code } from 'lucide-react';
import { GITHUB_REPO_URL } from '../constants';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
    onExport: () => void;
    onImport: (file: File) => void;
}

const Sidebar = ({ onExport, onImport }: SidebarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImport(file);
        e.target.value = '';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="user-info">
                    <div className="user-avatar">M</div>
                    <span className="user-name">MindMap</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className="active">
                        <button type="button" className="sidebar-link">
                            <Home size={20} />
                            <span>Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" className="sidebar-link" onClick={onExport}>
                            <Download size={20} />
                            <span>Export backup</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" className="sidebar-link" onClick={handleImportClick}>
                            <Upload size={20} />
                            <span>Import backup</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/json,.json"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                <ThemeToggle />
                <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-link sidebar-github"
                >
                    <Code size={18} />
                    <span>View on GitHub</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
