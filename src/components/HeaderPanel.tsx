import { useState } from 'react';
import { Panel } from '@xyflow/react';
import { ArrowLeft, MoreVertical, Layers, Palette } from 'lucide-react';
import { useHeaderActions } from '../hooks/useHeaderActions';

const HeaderPanel = ({ onBack }: { onBack: () => void }) => {
    const { handleLayoutNodes, handleColorize } = useHeaderActions();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Panel position="top-left" className="HeaderPanel toolbar">
            <button type="button" className="toolbar-btn" title="Back to Projects" onClick={onBack}>
                <ArrowLeft size={22} />
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
    );
};

export default HeaderPanel;
