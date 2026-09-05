const Header = () => {
    return (
        <header className="relative flex shrink-0 items-center justify-between gap-4 overflow-hidden border-b border-border/70 bg-card/70 px-6 py-4 backdrop-blur-md sm:px-10">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_70%)]" />
            <div className="relative min-w-0">
                <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                    Everything stays on this device
                </p>
            </div>
        </header>
    );
};

export default Header;
