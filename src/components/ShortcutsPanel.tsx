import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const shortcuts = [
    { keys: 'Tab', action: 'Create child node' },
    { keys: 'Enter', action: 'Create sibling node' },
    { keys: 'Delete', action: 'Remove selected node' },
    { keys: '+ buttons', action: 'Add nodes on left/right' },
    { keys: 'Click node', action: 'Edit label inline' },
];

const ShortcutsPanel = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" title="Keyboard shortcuts">
                    <Keyboard className="size-5" />
                </Button>
            </SheetTrigger>
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
                        <li
                            key={item.keys}
                            className="flex items-center justify-between gap-4 text-sm"
                        >
                            <kbd className="rounded-md border bg-muted px-2 py-1 font-mono text-xs">
                                {item.keys}
                            </kbd>
                            <span className="text-right text-muted-foreground">{item.action}</span>
                        </li>
                    ))}
                </ul>
            </SheetContent>
        </Sheet>
    );
};

export default ShortcutsPanel;
