import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT';

export function HoverBorderGradient({
    children,
    containerClassName,
    className,
    as: Tag = 'button',
    duration = 1,
    clockwise = true,
    ...props
}: React.PropsWithChildren<
    {
        as?: React.ElementType;
        containerClassName?: string;
        className?: string;
        duration?: number;
        clockwise?: boolean;
    } & React.HTMLAttributes<HTMLElement>
>) {
    const [hovered, setHovered] = useState(false);
    const [direction, setDirection] = useState<Direction>('TOP');

    const movingMap: Record<Direction, string> = {
        TOP: 'radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)',
        LEFT: 'radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)',
        BOTTOM: 'radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)',
        RIGHT: 'radial-gradient(16.2% 41.2% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)',
    };

    const highlight =
        'radial-gradient(75% 181.15942028985506% at 50% 50%, #6f34dc 0%, rgba(255, 255, 255, 0) 100%)';

    useEffect(() => {
        if (hovered) return;
        const directions: Direction[] = ['TOP', 'LEFT', 'BOTTOM', 'RIGHT'];
        const interval = setInterval(() => {
            setDirection((prevState) => {
                const currentIndex = directions.indexOf(prevState);
                const nextIndex = clockwise
                    ? (currentIndex - 1 + directions.length) % directions.length
                    : (currentIndex + 1) % directions.length;
                return directions[nextIndex];
            });
        }, duration * 1000);
        return () => clearInterval(interval);
    }, [hovered, duration, clockwise]);

    return (
        <Tag
            {...props}
            type={Tag === 'button' ? 'button' : undefined}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                'relative flex h-min w-fit flex-col flex-nowrap content-center items-center justify-center overflow-visible rounded-full border p-px transition duration-500',
                containerClassName,
            )}
        >
            <div className={cn('relative z-10 w-auto rounded-[inherit]', className)}>
                {children}
            </div>
            <motion.div
                className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
                style={{ filter: 'blur(2px)' }}
                initial={{ background: movingMap[direction] }}
                animate={{
                    background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
                }}
                transition={{ ease: 'linear', duration: duration ?? 1 }}
            />
        </Tag>
    );
}
