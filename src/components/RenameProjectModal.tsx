import { useState, useEffect, useRef } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RenameProjectModalProps {
    isOpen: boolean;
    currentName: string;
    onClose: () => void;
    onRename: (name: string) => Promise<void>;
}

const RenameProjectModal = ({
    isOpen,
    currentName,
    onClose,
    onRename,
}: RenameProjectModalProps) => {
    const [name, setName] = useState(currentName);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => inputRef.current?.focus(), 150);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setError('');
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter a name.');
            return;
        }
        if (trimmed === currentName) {
            onClose();
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await onRename(trimmed);
            onClose();
        } catch {
            setError('Failed to rename project. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rename mind map</DialogTitle>
                    <DialogDescription>Choose a new name for your project.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="rename-input">Name</Label>
                        <Input
                            ref={inputRef}
                            id="rename-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-invalid={!!error}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <Pencil />}
                            {isLoading ? 'Saving...' : 'Rename'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RenameProjectModal;
