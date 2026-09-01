import { useState } from 'react';
import { Panel } from '@xyflow/react';
import { ArrowLeft, MoreVertical, Layers, Palette, Keyboard, Check, Loader2 } from 'lucide-react';
import { useHeaderActions } from '../hooks/useHeaderActions';
import ShortcutsPanel from './ShortcutsPanel';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface HeaderPanelProps {
    onBack: () => void;
    saveStatus: SaveStatus;
}

const HeaderPanel = ({ onBack, saveStatus }: HeaderPanelProps) => {
    const { handleLayoutNodes, handleColorize } = useHeaderActions();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

    return (
        <>
            <Panel position="top-left" className="HeaderPanel toolbar">
                <button
                    type="button"
                    className="toolbar-btn"
                    title="Back to dashboard"
                    onClick={onBack}
                >
                    <ArrowLeft size={22} />
                </button>
                <div className="save-status" aria-live="polite">
                    {saveStatus === 'saving' && (
                        <>
                            <Loader2 size={14} className="save-spinner" />
                            <span>Saving...</span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <Check size={14} />
                            <span>Saved</span>
                        </>
                    )}
                </div>
                <button
                    type="button"
                    className="toolbar-btn"
                    title="Keyboard shortcuts"
                    onClick={() => setIsShortcutsOpen(true)}
                >
                    <Keyboard size={20} />
                </button>
                <div className="toolbar-menu">
                    <button
                        type="button"
                        className="toolbar-btn"
                        title="More"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <MoreVertical size={22} />
                    </button>
                    {isMenuOpen && (
                        <div className="more-container">
                            <div
                                className="more-item"
                                title="Adjust layout"
                                onClick={() => {
                                    handleLayoutNodes();
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Layers size={20} />
                                <p>Adjust layout</p>
                            </div>
                            <div
                                className="more-item"
                                title="Colorize"
                                onClick={() => {
                                    handleColorize();
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Palette size={20} />
                                <p>Colorize</p>
                            </div>
                        </div>
                    )}
                </div>
            </Panel>
            <ShortcutsPanel isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
        </>
    );
};

export default HeaderPanel;
