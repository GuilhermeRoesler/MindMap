import { Panel } from '@xyflow/react';
import { ArrowLeft, Check, Layers, Loader2, MoreVertical, Palette } from 'lucide-react';
import { useHeaderActions } from '@/hooks/useHeaderActions';
import ShortcutsPanel from './ShortcutsPanel';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface HeaderPanelProps {
    onBack: () => void;
    saveStatus: SaveStatus;
}

const HeaderPanel = ({ onBack, saveStatus }: HeaderPanelProps) => {
    const { handleLayoutNodes, handleColorize } = useHeaderActions();

    return (
        <>
            <Panel
                position="top-left"
                className="flex items-center gap-2 rounded-xl border bg-card p-2 shadow-md"
            >
                <Button variant="ghost" size="icon-sm" title="Back to dashboard" onClick={onBack}>
                    <ArrowLeft className="size-5" />
                </Button>

                <div
                    className="flex items-center gap-1.5 px-2 text-xs text-muted-foreground"
                    aria-live="polite"
                >
                    {saveStatus === 'saving' && (
                        <>
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>Saving...</span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <Check className="size-3.5 text-primary" />
                            <span>Saved</span>
                        </>
                    )}
                </div>

                <ShortcutsPanel />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" title="More">
                            <MoreVertical className="size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="right" className="w-44">
                        <DropdownMenuItem onClick={handleLayoutNodes}>
                            <Layers />
                            Adjust layout
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleColorize}>
                            <Palette />
                            Colorize
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Panel>
        </>
    );
};

export default HeaderPanel;
