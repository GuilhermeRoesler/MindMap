import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyProjectsStateProps {
    onCreate: () => void;
}

const EmptyProjectsState = ({ onCreate }: EmptyProjectsStateProps) => {
    return (
        <div className="empty-projects flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-card/50 px-6 py-16 text-center">
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-7" />
            </div>
            <svg
                width="180"
                height="110"
                viewBox="0 0 180 110"
                fill="none"
                aria-hidden="true"
                className="mb-6 opacity-90"
            >
                <path
                    d="M52 55 C78 55, 88 28, 114 28"
                    stroke="var(--primary)"
                    strokeWidth="2.2"
                    strokeOpacity="0.5"
                    fill="none"
                    className="thumb-edge-draw"
                />
                <path
                    d="M52 55 C78 55, 88 82, 114 82"
                    stroke="#F59E0B"
                    strokeWidth="2.2"
                    strokeOpacity="0.5"
                    fill="none"
                    className="thumb-edge-draw"
                    style={{ animationDelay: '80ms' }}
                />
                <rect
                    x="18"
                    y="40"
                    width="34"
                    height="30"
                    rx="9"
                    fill="var(--card)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    className="thumb-node-appear"
                />
                <rect
                    x="114"
                    y="14"
                    width="48"
                    height="26"
                    rx="8"
                    fill="var(--card)"
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                    strokeOpacity="0.75"
                    className="thumb-node-appear"
                    style={{ animationDelay: '100ms' }}
                />
                <rect
                    x="114"
                    y="68"
                    width="48"
                    height="26"
                    rx="8"
                    fill="var(--card)"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeOpacity="0.75"
                    className="thumb-node-appear"
                    style={{ animationDelay: '160ms' }}
                />
                <text
                    x="35"
                    y="58"
                    textAnchor="middle"
                    fill="var(--card-foreground)"
                    fontSize="8"
                    fontWeight="600"
                >
                    Idea
                </text>
                <text
                    x="138"
                    y="30"
                    textAnchor="middle"
                    fill="var(--card-foreground)"
                    fontSize="7"
                    fontWeight="500"
                >
                    Branch
                </text>
                <text
                    x="138"
                    y="84"
                    textAnchor="middle"
                    fill="var(--card-foreground)"
                    fontSize="7"
                    fontWeight="500"
                >
                    Detail
                </text>
            </svg>
            <h3 className="mb-2 text-xl font-semibold tracking-tight">Start with a blank map</h3>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Capture a messy thought, split it into branches, and watch the structure appear —
                all without leaving this browser.
            </p>
            <Button onClick={onCreate} size="lg" className="shadow-md shadow-primary/20">
                Create your first map
            </Button>
        </div>
    );
};

export default EmptyProjectsState;
