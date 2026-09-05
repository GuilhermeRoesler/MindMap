import { useRef } from 'react';
import { Code, Download, Home, Upload } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/constants';
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
        <aside className="flex w-65 shrink-0 flex-col border-r border-border/70 bg-sidebar/90 p-3 backdrop-blur-md">
            <div className="mb-1 flex items-center gap-3 px-2 py-3">
                <MindMapIcon size={34} withBackground />
                <div className="min-w-0">
                    <span className="block font-semibold tracking-tight">MindMap</span>
                    <span className="block text-[11px] text-muted-foreground">Visual thinking</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 py-2">
                <Button variant="secondary" className="w-full justify-start">
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

            <div className="space-y-2 border-t border-border/70 pt-3">
                <ThemeToggle />
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
