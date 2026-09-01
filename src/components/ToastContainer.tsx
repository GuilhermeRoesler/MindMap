import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast, type ToastType } from '../context/ToastContext';

const icons: Record<ToastType, typeof Info> = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
};

const ToastContainer = () => {
    const { toasts, dismissToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map((toast) => {
                const Icon = icons[toast.type];
                return (
                    <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
                        <Icon size={18} className="toast-icon" />
                        <span className="toast-message">{toast.message}</span>
                        <button
                            type="button"
                            className="toast-dismiss"
                            onClick={() => dismissToast(toast.id)}
                            aria-label="Dismiss"
                        >
                            <X size={16} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ToastContainer;
