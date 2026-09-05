import { Lightbulb, X } from 'lucide-react';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface OnboardingBannerProps {
    onDismiss: () => void;
}

const OnboardingBanner = ({ onDismiss }: OnboardingBannerProps) => {
    return (
        <div className="onboarding-float">
            <Alert className="editor-glass-panel border-primary/25 shadow-lg">
                <Lightbulb className="text-primary" />
                <AlertTitle>Welcome</AlertTitle>
                <AlertDescription>
                    Double-click a node to edit. Use{' '}
                    <kbd className="rounded border bg-muted/80 px-1">Tab</kbd> for children and{' '}
                    <kbd className="rounded border bg-muted/80 px-1">Enter</kbd> for siblings. Open
                    the menu for layout and color tools.
                </AlertDescription>
                <AlertAction>
                    <Button variant="ghost" size="icon-sm" onClick={onDismiss} aria-label="Dismiss">
                        <X />
                    </Button>
                </AlertAction>
            </Alert>
        </div>
    );
};

export default OnboardingBanner;
