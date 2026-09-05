import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyProjectsStateProps {
    onCreate: () => void;
}

const EmptyProjectsState = ({ onCreate }: EmptyProjectsStateProps) => {
    return (
        <div className="empty-projects flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-card/50 px-6 py-16 text-center">
            <svg
                width="160"
                height="100"
                viewBox="0 0 160 100"
                fill="none"
                aria-hidden="true"
                className="mb-6 opacity-90"
            >
                <path
                    d="M48 50 C70 50, 78 28, 100 28"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeOpacity="0.45"
                    fill="none"
                />
                <path
                    d="M48 50 C70 50, 78 72, 100 72"
                    stroke="#DD59C9"
                    strokeWidth="2"
                    strokeOpacity="0.45"
                    fill="none"
                />
                <rect
                    x="18"
                    y="36"
                    width="30"
                    height="28"
                    rx="8"
                    fill="var(--card)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                />
                <rect
                    x="100"
                    y="16"
                    width="42"
                    height="24"
                    rx="7"
                    fill="var(--card)"
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                />
                <rect
                    x="100"
                    y="60"
                    width="42"
                    height="24"
                    rx="7"
                    fill="var(--card)"
                    stroke="#DD59C9"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                />
                <circle cx="33" cy="50" r="3" fill="var(--primary)" />
            </svg>
            <h3 className="mb-2 text-xl font-semibold tracking-tight">Your canvas is empty</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Create a mind map to capture ideas, branch thoughts, and see connections take shape.
            </p>
            <Button onClick={onCreate}>
                <Plus />
                Create your first map
            </Button>
        </div>
    );
};

export default EmptyProjectsState;
