import { Play, Plus, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import MindMapPreview from '@/components/MindMapPreview';

interface DashboardHeroProps {
    onTryDemo: () => void;
    onCreateNew: () => void;
    onDismiss: () => void;
}

const DashboardHero = ({ onTryDemo, onCreateNew, onDismiss }: DashboardHeroProps) => {
    return (
        <section className="dashboard-hero relative mb-10 grid items-center gap-8 overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent p-5 sm:p-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <Spotlight className="-top-40 left-0 md:-top-20 md:left-20" fill="#6f34dc" />
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3 z-20 text-muted-foreground"
                title="Dismiss welcome"
                aria-label="Dismiss welcome"
                onClick={onDismiss}
            >
                <X />
            </Button>
            <div className="relative z-10">
                <p className="mb-3 text-sm font-semibold tracking-[0.14em] text-primary uppercase">
                    MindMap
                </p>
                <h2 className="mb-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                    <TextGenerateEffect
                        words="Think visually."
                        className="text-3xl font-semibold sm:text-4xl"
                        wordClassName="text-foreground"
                        duration={0.35}
                    />
                    <motion.span
                        className="mt-1 block text-primary"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.45 }}
                    >
                        Stay local.
                    </motion.span>
                </h2>
                <p className="mb-7 max-w-lg text-base leading-relaxed text-muted-foreground">
                    Drag ideas into a living map — auto layout, color-coded branches, and instant
                    save in your browser. No account. No noise.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                    <HoverBorderGradient
                        onClick={onTryDemo}
                        containerClassName="rounded-lg border-primary/25 bg-primary/15 shadow-md shadow-primary/20"
                        className="flex items-center gap-2 rounded-[calc(var(--radius-lg)-1px)] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
                        duration={1.2}
                    >
                        <Play className="size-4" />
                        Open roadmap
                    </HoverBorderGradient>
                    <Button size="lg" variant="outline" onClick={onCreateNew}>
                        <Plus />
                        Create new map
                    </Button>
                </div>
            </div>
            <div className="relative z-10">
                <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)] blur-2xl" />
                <MindMapPreview />
            </div>
        </section>
    );
};

export default DashboardHero;
