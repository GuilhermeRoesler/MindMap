import { Sparkles, Play } from 'lucide-react';

interface DashboardHeroProps {
    onTryDemo: () => void;
    onCreateNew: () => void;
}

const DashboardHero = ({ onTryDemo, onCreateNew }: DashboardHeroProps) => {
    return (
        <section className="dashboard-hero">
            <div className="hero-content">
                <div className="hero-badge">
                    <Sparkles size={14} />
                    Portfolio project
                </div>
                <h2 className="hero-title">Interactive mind maps in your browser</h2>
                <p className="hero-description">
                    Create, organize, and visualize ideas with drag-and-drop nodes, auto layout, and
                    color-coded connections. No account required — everything stays on your device.
                </p>
                <div className="hero-actions">
                    <button
                        type="button"
                        className="btn-brand hero-btn-primary"
                        onClick={onTryDemo}
                    >
                        <Play size={16} />
                        Try Demo
                    </button>
                    <button
                        type="button"
                        className="btn-secondary hero-btn-secondary"
                        onClick={onCreateNew}
                    >
                        Create new map
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DashboardHero;
