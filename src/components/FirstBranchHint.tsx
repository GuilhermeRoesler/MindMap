interface FirstBranchHintProps {
    visible: boolean;
}

const FirstBranchHint = ({ visible }: FirstBranchHintProps) => {
    if (!visible) return null;

    return (
        <div className="editor-branch-hint" role="status">
            <span className="editor-branch-hint__pulse" aria-hidden />
            Press <kbd>Tab</kbd> to grow your first branch
        </div>
    );
};

export default FirstBranchHint;
