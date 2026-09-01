import { Code, ExternalLink } from 'lucide-react';
import { GITHUB_REPO_URL, LIVE_DEMO_URL } from '@/constants';
import MindMapIcon from '@/icons/MindMapIcon';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Header = () => {
    return (
        <header className="flex shrink-0 items-center justify-between border-b bg-card px-10 py-4">
            <h1 className="flex items-center gap-2.5 text-2xl font-bold">
                <MindMapIcon size={28} withBackground className="shrink-0" />
                MindMap
            </h1>
            <div className="flex items-center gap-3">
                <span className="hidden text-sm text-muted-foreground sm:inline">
                    Data saved locally in your browser
                </span>
                <ThemeToggle compact />
                <Separator orientation="vertical" className="hidden h-6 sm:block" />
                <Button variant="ghost" size="sm" asChild>
                    <a
                        href={LIVE_DEMO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Live demo"
                    >
                        <ExternalLink />
                        <span className="hidden sm:inline">Live</span>
                    </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                    <a
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View source on GitHub"
                    >
                        <Code />
                        <span className="hidden sm:inline">Source</span>
                    </a>
                </Button>
            </div>
        </header>
    );
};

export default Header;
