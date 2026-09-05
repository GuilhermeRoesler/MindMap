import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface HoverGridProps {
    className?: string;
    children: (api: {
        hoveredIndex: number | null;
        setHoveredIndex: (index: number | null) => void;
    }) => ReactNode;
}

/** Shared hover backdrop for a grid of cards (Aceternity card-hover-effect pattern). */
export function HoverGrid({ className, children }: HoverGridProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return <div className={cn(className)}>{children({ hoveredIndex, setHoveredIndex })}</div>;
}

interface HoverGridItemProps {
    index: number;
    hoveredIndex: number | null;
    setHoveredIndex: (index: number | null) => void;
    className?: string;
    children: ReactNode;
}

export function HoverGridItem({
    index,
    hoveredIndex,
    setHoveredIndex,
    className,
    children,
}: HoverGridItemProps) {
    return (
        <div
            className={cn('relative block h-full w-full', className)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <AnimatePresence>
                {hoveredIndex === index && (
                    <motion.span
                        className="absolute inset-0 z-0 block h-full w-full rounded-2xl bg-primary/8 dark:bg-primary/15"
                        layoutId="project-card-hover"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { duration: 0.15 },
                        }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.15, delay: 0.1 },
                        }}
                    />
                )}
            </AnimatePresence>
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
}
