import { useState, useEffect, useRef } from 'react';
import { Loader2, Plus } from 'lucide-react';
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

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => Promise<void>;
}

const CreateProjectModal = ({ isOpen, onClose, onCreate }: CreateProjectModalProps) => {
    const [name, setName] = useState('');
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
            setName('');
            setError('');
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter a name for your mind map.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await onCreate(name.trim());
        } catch {
            setError('Failed to create project. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New Mind Map</DialogTitle>
                    <DialogDescription>
                        Give your new project a name to get started.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="project-name">Name</Label>
                        <Input
                            ref={inputRef}
                            id="project-name"
                            placeholder="e.g., Marketing Plan Q3"
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
                            {isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectModal;
