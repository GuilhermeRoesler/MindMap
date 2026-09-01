import { useReactFlow } from "@xyflow/react";
import { useLayoutNodes } from "./useLayoutNodes";
import { useConnectionColors } from "./useConnectionColors";

export const useHeaderActions = () => {
    const { fitView } = useReactFlow();
    const { layoutNodes } = useLayoutNodes();
    const { updateConnectionColors } = useConnectionColors();

    const handleHome = () => {
        console.log('Home');
    }

    const handleLayoutNodes = () => {
        layoutNodes();
        setTimeout(() => {
            fitView({ duration: 800 });
        }, 100);
    }

    const handleColorize = () => {
        updateConnectionColors();
    }

    return {
        handleHome,
        handleLayoutNodes,
        handleColorize
    }
}
