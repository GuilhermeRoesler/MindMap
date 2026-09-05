import { Play, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MindMapPreview from '@/components/MindMapPreview';

interface DashboardHeroProps {
    onTryDemo: () => void;
    onCreateNew: () => void;
    onDismiss: () => void;
}

const DashboardHero = ({ onTryDemo, onCreateNew, onDismiss }: DashboardHeroProps) => {
    return (
        <section className="dashboard-hero relative mb-10 grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-0 right-0 z-20 text-muted-foreground"
                title="Dismiss welcome"
                aria-label="Dismiss welcome"
                onClick={onDismiss}
            >
                <X />
            </Button>
            <div className="relative z-10">
                <p className="mb-3 text-sm font-medium tracking-wide text-primary">MindMap</p>
                <h2 className="mb-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                    Think visually.
                    <span className="block text-primary">Stay local.</span>
                </h2>
                <p className="mb-7 max-w-lg text-base leading-relaxed text-muted-foreground">
                    Drag ideas into a living map — auto layout, color-coded branches, and instant
                    save in your browser. No account. No noise.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button size="lg" onClick={onTryDemo} className="shadow-md shadow-primary/25">
                        <Play />
                        Open roadmap
                    </Button>
                    <Button size="lg" variant="outline" onClick={onCreateNew}>
                        <Plus />
                        Create new map
                    </Button>
                </div>
            </div>
            <div className="relative">
                <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)] blur-2xl" />
                <MindMapPreview />
            </div>
        </section>
    );
};

export default DashboardHero;
