import { Panel } from '@xyflow/react';
import {
    ArrowLeft,
    Check,
    ImageDown,
    Keyboard,
    Layers,
    Loader2,
    MoreVertical,
    Palette,
} from 'lucide-react';
import { useHeaderActions } from '@/hooks/useHeaderActions';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface HeaderPanelProps {
    onBack: () => void;
    saveStatus: SaveStatus;
    projectName: string;
    nodeCount: number;
    onExportPng: () => void;
    isExporting?: boolean;
    onOpenShortcuts?: () => void;
}

const HeaderPanel = ({
    onBack,
    saveStatus,
    projectName,
    nodeCount,
    onExportPng,
    isExporting = false,
    onOpenShortcuts,
}: HeaderPanelProps) => {
    const { handleLayoutNodes, handleColorize } = useHeaderActions();

    return (
        <>
            <Panel
                position="top-left"
                className="editor-glass-panel !m-2 flex max-w-[min(100vw-1rem,28rem)] items-center gap-1 rounded-xl !p-1.5"
            >
                <Button variant="ghost" size="icon-sm" title="Back to dashboard" onClick={onBack}>
                    <ArrowLeft className="size-5" />
                </Button>

                <div className="min-w-0 flex-1 px-1.5">
                    <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                        {projectName}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                        {nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}
                    </p>
                </div>

                <div
                    className={`save-status-pill save-status-pill--${saveStatus}`}
                    aria-live="polite"
                >
                    {saveStatus === 'saving' && (
                        <>
                            <Loader2 className="size-3 animate-spin" />
                            <span>Saving</span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <Check className="size-3 text-primary" />
                            <span>Saved</span>
                        </>
                    )}
                </div>

                {onOpenShortcuts && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Keyboard shortcuts"
                        onClick={onOpenShortcuts}
                    >
                        <Keyboard className="size-5" />
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" title="More">
                            <MoreVertical className="size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="right" className="w-48">
                        <DropdownMenuItem onClick={handleLayoutNodes}>
                            <Layers />
                            Adjust layout
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleColorize}>
                            <Palette />
                            Colorize
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onExportPng} disabled={isExporting}>
                            <ImageDown />
                            {isExporting ? 'Exporting…' : 'Export PNG'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Panel>
        </>
    );
};

export default HeaderPanel;
