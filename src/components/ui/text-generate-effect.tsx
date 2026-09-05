import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import { cn } from '@/lib/utils';

export const TextGenerateEffect = ({
    words,
    className,
    wordClassName,
    filter = true,
    duration = 0.45,
}: {
    words: string;
    className?: string;
    wordClassName?: string;
    filter?: boolean;
    duration?: number;
}) => {
    const [scope, animate] = useAnimate();
    const wordsArray = words.split(' ');

    useEffect(() => {
        animate(
            'span',
            {
                opacity: 1,
                filter: filter ? 'blur(0px)' : 'none',
            },
            {
                duration: duration ?? 1,
                delay: stagger(0.12),
            },
        );
    }, [animate, duration, filter]);

    return (
        <div className={cn('leading-snug tracking-tight', className)}>
            <motion.div ref={scope}>
                {wordsArray.map((word, idx) => (
                    <motion.span
                        key={word + idx}
                        className={cn('inline-block opacity-0', wordClassName)}
                        style={{
                            filter: filter ? 'blur(8px)' : 'none',
                        }}
                    >
                        {word}&nbsp;
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
};
