import { Plus } from 'lucide-react';
import useNodeHandler from '../hooks/useNodeHandler';

const AddButton = ({ type, id }: { type: 'left' | 'right'; id: string }) => {
    const { createAdjacentNode } = useNodeHandler();

    return (
        <button
            className={`add-button add-button-${type}`}
            onClick={(e) => {
                e.stopPropagation();
                createAdjacentNode(id, type);
            }}
        >
            <Plus size={12} />
        </button>
    );
};

export default AddButton;
