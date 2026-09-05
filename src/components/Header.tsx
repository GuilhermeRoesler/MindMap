import { Code, ExternalLink } from 'lucide-react';
import { GITHUB_REPO_URL, LIVE_DEMO_URL } from '@/constants';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Header = () => {
    return (
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border/70 bg-card/70 px-6 py-4 backdrop-blur-md sm:px-10">
            <div className="min-w-0">
                <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                    Everything stays on this device
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
