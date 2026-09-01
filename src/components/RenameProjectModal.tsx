import { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import LoadingSpinner from '../icons/LoadingSpinner';

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Rename mind map</h2>
                <p className="modal-description">Choose a new name for your project.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="rename-input" className="modal-label">
                        Name
                    </label>
                    <input
                        ref={inputRef}
                        id="rename-input"
                        type="text"
                        className="modal-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {error && <p className="modal-error">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-brand" disabled={isLoading}>
                            {isLoading ? (
                                <LoadingSpinner size="h-5 w-5" color="border-white" />
                            ) : (
                                <Pencil size={16} />
                            )}
                            {isLoading ? 'Saving...' : 'Rename'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameProjectModal;
