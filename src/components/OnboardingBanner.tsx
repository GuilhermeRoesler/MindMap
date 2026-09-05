import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingBannerProps {
    onDismiss: () => void;
    onOpenShortcuts?: () => void;
}

const OnboardingBanner = ({ onDismiss, onOpenShortcuts }: OnboardingBannerProps) => {
    return (
        <div className="onboarding-corner animate-fade-in" role="status">
            <div className="editor-glass-panel rounded-2xl border border-primary/20 p-3.5 shadow-lg">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                        <Keyboard className="size-4 text-primary" />
                        Keyboard-first
                    </div>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onDismiss}
                        aria-label="Dismiss"
                        className="shrink-0 text-muted-foreground"
                    >
                        <X />
                    </Button>
                </div>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                    Double-click to edit. Use{' '}
                    <kbd className="rounded border bg-muted/80 px-1 font-mono">Tab</kbd> for
                    children and{' '}
                    <kbd className="rounded border bg-muted/80 px-1 font-mono">Enter</kbd> for
                    siblings.
                </p>
                <div className="flex flex-wrap gap-2">
                    {onOpenShortcuts && (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                onOpenShortcuts();
                                onDismiss();
                            }}
                        >
                            View shortcuts
                        </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={onDismiss}>
                        Got it
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingBanner;
