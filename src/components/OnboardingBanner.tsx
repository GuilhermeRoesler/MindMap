import { Lightbulb, X } from 'lucide-react';

interface OnboardingBannerProps {
    onDismiss: () => void;
}

const OnboardingBanner = ({ onDismiss }: OnboardingBannerProps) => {
    return (
        <div className="onboarding-banner" role="status">
            <Lightbulb size={20} className="onboarding-icon" />
            <div className="onboarding-text">
                <strong>Welcome!</strong> Click any node to edit its label. Use <kbd>Tab</kbd> for
                child nodes and <kbd>Enter</kbd> for siblings. Open the menu for layout and color
                tools.
            </div>
            <button
                type="button"
                className="onboarding-dismiss"
                onClick={onDismiss}
                aria-label="Dismiss"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default OnboardingBanner;
