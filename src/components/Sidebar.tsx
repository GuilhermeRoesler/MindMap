import { useRef } from 'react';
import { Code, Download, ExternalLink, Home, Upload } from 'lucide-react';
import { GITHUB_REPO_URL, LIVE_DEMO_URL } from '@/constants';
import MindMapIcon from '@/icons/MindMapIcon';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';

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
        <aside className="sidebar-shell flex w-65 shrink-0 flex-col border-r border-border/70 bg-sidebar/90 p-3 backdrop-blur-md">
            <div className="sidebar-brand mb-4 overflow-hidden rounded-2xl px-3 py-4">
                <div className="relative z-10 flex items-center gap-3">
                    <MindMapIcon size={40} withBackground />
                    <div className="min-w-0">
                        <span className="block text-base font-semibold tracking-tight">
                            MindMap
                        </span>
                        <span className="block text-[11px] font-medium text-primary">
                            Visual thinking · local
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 py-1">
                <p className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Workspace
                </p>
                <Button variant="secondary" className="w-full justify-start shadow-sm">
                    <Home />
                    Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={onExport}>
                    <Download />
                    Export backup
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleImportClick}
                >
                    <Upload />
                    Import backup
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </nav>

            <div className="space-y-1 border-t border-border/70 pt-3">
                <p className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Preferences
                </p>
                <ThemeToggle />
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href={LIVE_DEMO_URL} target="_blank" rel="noopener noreferrer">
                        <ExternalLink />
                        Live demo
                    </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
                        <Code />
                        View on GitHub
                    </a>
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
