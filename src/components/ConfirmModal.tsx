import { AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../icons/LoadingSpinner';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'default';
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
}

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isLoading = false,
    variant = 'default',
    onConfirm,
    onClose,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon-wrap">
                    <AlertTriangle
                        size={24}
                        className={variant === 'danger' ? 'text-red-500' : 'text-brand'}
                    />
                </div>
                <h2 id="confirm-modal-title" className="modal-title">
                    {title}
                </h2>
                <p className="modal-description">{message}</p>
                <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={variant === 'danger' ? 'btn-danger' : 'btn-brand'}
                        disabled={isLoading}
                        onClick={() => void onConfirm()}
                    >
                        {isLoading ? <LoadingSpinner size="h-5 w-5" color="border-white" /> : null}
                        {isLoading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
