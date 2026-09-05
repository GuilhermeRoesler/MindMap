import { ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Project } from '@/utils/projectManager';
import MindMapIcon from '@/icons/MindMapIcon';
import MapThumbnail from '@/components/MapThumbnail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
    project: Project;
    onOpen: () => void;
    onRename: () => void;
    onDelete?: () => void;
    onRenameBlocked?: () => void;
    index?: number;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ProjectCard = ({
    project,
    onOpen,
    onRename,
    onDelete,
    onRenameBlocked,
    index = 0,
}: ProjectCardProps) => {
    return (
        <motion.article
            role="button"
            tabIndex={0}
            className={cn(
                'group project-card relative cursor-pointer overflow-hidden rounded-xl bg-card text-card-foreground',
                'shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.35)]',
                'dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]',
                'ring-1 ring-border/60 transition-[box-shadow,ring-color] duration-300 hover:ring-primary/35',
            )}
            style={{ animationDelay: `${index * 70}ms` }}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
            whileHover={{ y: -4, scale: 1.015 }}
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen();
                }
            }}
        >
            <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted/30">
                <MapThumbnail
                    nodes={project.nodes}
                    edges={project.edges}
                    showLabels
                    className="opacity-95 transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <MindMapIcon size={14} />
                        </div>
                        <h3 className="truncate font-semibold tracking-tight">{project.name}</h3>
                        {project.isDemo && (
                            <Badge variant="secondary" className="shrink-0">
                                Demo
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {project.nodes.length} nodes · Modified {formatDate(project.updatedAt)}
                    </p>
                </div>
                <div className="flex shrink-0 gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Rename"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (project.isDemo) {
                                onRenameBlocked?.();
                                return;
                            }
                            onRename();
                        }}
                    >
                        <Pencil />
                    </Button>
                    {onDelete && !project.isDemo && (
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Delete"
                            className="hover:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 />
                        </Button>
                    )}
                </div>
            </div>

            {/* Cult ShiftCard–inspired expand strip */}
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                    <div className="flex items-center justify-between border-t border-primary/10 bg-primary/5 px-4 py-2.5 text-xs font-medium text-primary">
                        <span>Open map</span>
                        <ArrowUpRight className="size-3.5" />
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default ProjectCard;
