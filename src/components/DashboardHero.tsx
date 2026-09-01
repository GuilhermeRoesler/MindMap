import { Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardHeroProps {
    onTryDemo: () => void;
    onCreateNew: () => void;
}

const DashboardHero = ({ onTryDemo, onCreateNew }: DashboardHeroProps) => {
    return (
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-card">
            <CardContent className="pt-6">
                <Badge variant="secondary" className="mb-4 gap-1.5 bg-primary/10 text-primary">
                    <Sparkles className="size-3.5" />
                    Portfolio project
                </Badge>
                <h2 className="mb-2 text-2xl font-bold tracking-tight">
                    Interactive mind maps in your browser
                </h2>
                <p className="mb-6 max-w-2xl text-muted-foreground">
                    Create, organize, and visualize ideas with drag-and-drop nodes, auto layout, and
                    color-coded connections. No account required — everything stays on your device.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button onClick={onTryDemo}>
                        <Play />
                        Try Demo
                    </Button>
                    <Button variant="outline" onClick={onCreateNew}>
                        Create new map
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardHero;
