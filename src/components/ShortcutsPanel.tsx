import { Keyboard } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

const shortcuts = [
    { keys: 'Tab', action: 'Create child node' },
    { keys: 'Enter', action: 'Create sibling node' },
    { keys: 'Delete', action: 'Remove selected node' },
    { keys: '+ buttons', action: 'Add nodes on left/right' },
    { keys: 'Double-click', action: 'Edit label inline' },
    { keys: 'Shift + drag', action: 'Multi-select' },
];

const ShortcutsSheetChrome = () => (
    <SheetContent side="right" className="w-80">
        <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
                <Keyboard className="size-4" />
                Keyboard shortcuts
            </SheetTitle>
            <SheetDescription>Quick reference for editing your mind map.</SheetDescription>
        </SheetHeader>
        <ul className="mt-6 space-y-3">
            {shortcuts.map((item) => (
                <li key={item.keys} className="flex items-center justify-between gap-4 text-sm">
                    <kbd className="rounded-md border bg-muted px-2 py-1 font-mono text-xs">
                        {item.keys}
                    </kbd>
                    <span className="text-right text-muted-foreground">{item.action}</span>
                </li>
            ))}
        </ul>
    </SheetContent>
);

/** Persistent bottom dock — makes shortcuts a visible product feature. */
export const ShortcutsDock = ({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    return (
        <>
            <button
                type="button"
                className="shortcut-dock"
                onClick={() => onOpenChange(true)}
                title="Keyboard shortcuts"
            >
                <span className="shortcut-dock__keys">
                    <kbd>Tab</kbd>
                    <span className="text-muted-foreground">child</span>
                    <span className="shortcut-dock__dot" aria-hidden />
                    <kbd>Enter</kbd>
                    <span className="text-muted-foreground">sibling</span>
                </span>
                <Keyboard className="size-3.5 text-primary" />
            </button>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <ShortcutsSheetChrome />
            </Sheet>
        </>
    );
};

export default ShortcutsDock;
