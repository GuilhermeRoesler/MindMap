import { demoEdges, demoNodes } from '@/data/demoProject';
import MapThumbnail from '@/components/MapThumbnail';

const MindMapPreview = () => {
    return (
        <div className="mindmap-preview relative overflow-hidden rounded-2xl border border-primary/15 bg-card/80 shadow-[0_20px_50px_-24px_rgba(111,52,220,0.45)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:18px_18px]" />
            <div className="relative aspect-[16/10] w-full p-2 sm:p-3">
                <MapThumbnail nodes={demoNodes} edges={demoEdges} animated showLabels />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/90 to-transparent" />
        </div>
    );
};

export default MindMapPreview;
