import React from 'react';

interface SettingsModalProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isDialogOpen, setIsDialogOpen }) => {
    if (!isDialogOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={() => setIsDialogOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={() => setIsDialogOpen(false)}>
                    &times;
                </button>
                <h2>Settings</h2>
                <p>Here are some settings for your mind map.</p>
                {/* Add settings controls here */}
            </div>
        </div>
    );
};

export default SettingsModal;