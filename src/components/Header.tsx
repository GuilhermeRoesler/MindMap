import { Code, ExternalLink } from 'lucide-react';
import { GITHUB_REPO_URL, LIVE_DEMO_URL } from '../constants';
import MindMapIcon from '../icons/MindMapIcon';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    return (
        <header className="main-header">
            <h1 className="logo">
                <MindMapIcon size={28} withBackground className="logo-icon" />
                MindMap
            </h1>
            <div className="header-actions">
                <span className="header-subtitle">Data saved locally in your browser</span>
                <ThemeToggle compact />
                <a
                    href={LIVE_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-link"
                    title="Live demo"
                >
                    <ExternalLink size={16} />
                    <span className="header-link-text">Live</span>
                </a>
                <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-link header-link-github"
                    title="View source on GitHub"
                >
                    <Code size={18} />
                    <span className="header-link-text">Source</span>
                </a>
            </div>
        </header>
    );
};

export default Header;
