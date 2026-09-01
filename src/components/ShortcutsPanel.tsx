import { Keyboard, X } from 'lucide-react';

const shortcuts = [
    { keys: 'Tab', action: 'Create child node' },
    { keys: 'Enter', action: 'Create sibling node' },
    { keys: 'Delete', action: 'Remove selected node' },
    { keys: '+ buttons', action: 'Add nodes on left/right' },
    { keys: 'Click node', action: 'Edit label inline' },
];

interface ShortcutsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShortcutsPanel = ({ isOpen, onClose }: ShortcutsPanelProps) => {
    if (!isOpen) return null;

    return (
        <div className="shortcuts-panel" role="dialog" aria-label="Keyboard shortcuts">
            <div className="shortcuts-header">
                <div className="shortcuts-title">
                    <Keyboard size={18} />
                    <span>Keyboard shortcuts</span>
                </div>
                <button type="button" className="toolbar-btn" onClick={onClose} aria-label="Close">
                    <X size={18} />
                </button>
            </div>
            <ul className="shortcuts-list">
                {shortcuts.map((item) => (
                    <li key={item.keys}>
                        <kbd>{item.keys}</kbd>
                        <span>{item.action}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShortcutsPanel;
