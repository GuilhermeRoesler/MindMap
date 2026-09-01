import { Lightbulb, X } from 'lucide-react';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface OnboardingBannerProps {
    onDismiss: () => void;
}

const OnboardingBanner = ({ onDismiss }: OnboardingBannerProps) => {
    return (
        <Alert className="mx-4 mt-4 border-primary/20 bg-primary/5">
            <Lightbulb className="text-primary" />
            <AlertTitle>Welcome!</AlertTitle>
            <AlertDescription>
                Click any node to edit its label. Use <kbd className="rounded border px-1">Tab</kbd>{' '}
                for child nodes and <kbd className="rounded border px-1">Enter</kbd> for siblings.
                Open the menu for layout and color tools.
            </AlertDescription>
            <AlertAction>
                <Button variant="ghost" size="icon-sm" onClick={onDismiss} aria-label="Dismiss">
                    <X />
                </Button>
            </AlertAction>
        </Alert>
    );
};

export default OnboardingBanner;
