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
            <i className="fa-solid fa-plus"></i>
        </button>
    )
}

export default AddButton