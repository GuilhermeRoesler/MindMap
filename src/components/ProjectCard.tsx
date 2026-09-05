import { Pencil, Trash2 } from 'lucide-react';
import type { Project } from '@/utils/projectManager';
import MindMapIcon from '@/icons/MindMapIcon';
import MapThumbnail from '@/components/MapThumbnail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectCardProps {
    project: Project;
    onOpen: () => void;
    onRename: () => void;
    onDelete?: () => void;
    onRenameBlocked?: () => void;
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
}: ProjectCardProps) => {
    return (
        <Card
            className="group project-card cursor-pointer overflow-hidden border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_40px_-28px_rgba(111,52,220,0.55)]"
            onClick={onOpen}
        >
            <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted/30">
                <MapThumbnail nodes={project.nodes} edges={project.edges} className="opacity-95" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <CardContent className="flex items-start justify-between gap-3 p-4">
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
                        Modified {formatDate(project.updatedAt)}
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
            </CardContent>
        </Card>
    );
};

export default ProjectCard;
