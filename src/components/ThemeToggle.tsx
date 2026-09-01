import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

const labels: Record<ThemeMode, string> = {
    system: 'System theme',
    light: 'Light theme',
    dark: 'Dark theme',
};

const icons: Record<ThemeMode, typeof Sun> = {
    system: Monitor,
    light: Sun,
    dark: Moon,
};

interface ThemeToggleProps {
    compact?: boolean;
}

const ThemeToggle = ({ compact = false }: ThemeToggleProps) => {
    const { themeMode, cycleTheme } = useTheme();
    const Icon = icons[themeMode];

    return (
        <Button
            type="button"
            variant="ghost"
            size={compact ? 'icon-sm' : 'default'}
            onClick={cycleTheme}
            title={labels[themeMode]}
            aria-label={labels[themeMode]}
            className={compact ? '' : 'w-full justify-start'}
        >
            <Icon />
            {!compact && <span>{labels[themeMode]}</span>}
        </Button>
    );
};

export default ThemeToggle;
