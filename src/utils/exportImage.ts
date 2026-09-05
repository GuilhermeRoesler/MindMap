import { toPng } from 'html-to-image';
import { getNodesBounds, getViewportForBounds, type Node } from '@xyflow/react';

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

function resolveCanvasBackground(): string {
    const flow = document.querySelector('.react-flow') as HTMLElement | null;
    if (flow) {
        const bg = getComputedStyle(flow).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
    }
    return getComputedStyle(document.body).backgroundColor || '#f3f5f7';
}

export async function exportFlowToPng(fileName: string, nodes: Node[]): Promise<void> {
    const viewportEl = document.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (!viewportEl) {
        throw new Error('Canvas not ready for export.');
    }

    const bounds = getNodesBounds(nodes);
    const { x, y, zoom } = getViewportForBounds(bounds, IMAGE_WIDTH, IMAGE_HEIGHT, 0.5, 2, 0.12);

    const dataUrl = await toPng(viewportEl, {
        backgroundColor: resolveCanvasBackground(),
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        style: {
            width: `${IMAGE_WIDTH}px`,
            height: `${IMAGE_HEIGHT}px`,
            transform: `translate(${x}px, ${y}px) scale(${zoom})`,
        },
        pixelRatio: 2,
    });

    const link = document.createElement('a');
    const safeName = fileName.replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '') || 'mindmap';
    link.download = `${safeName}.png`;
    link.href = dataUrl;
    link.click();
}
