# AI Development Rules

This document outlines the technology stack and provides clear rules for the AI assistant on which libraries to use for specific tasks within this project.

## Tech Stack

This is a mind-mapping application built with the following technologies:

-   **Framework:** React with TypeScript, built using Vite.
-   **Core Visualization:** `@xyflow/react` is used to render and manage the mind map canvas, nodes, and edges.
-   **Automatic Layout:** `dagre` is integrated for calculating and applying automatic graph layouts.
-   **State Management:** React hooks (`useState`, `useCallback`) are used for local component state. `@xyflow/react`'s built-in hooks manage the flow state.
-   **Unique IDs:** The `ulid` library is used to generate unique, sortable identifiers for new nodes and edges.
-   **Styling:** Custom CSS is written in `src/App.css`.
-   **Icons:** The project uses [Material Symbols](https://fonts.google.com/icons) and [Font Awesome](https://fontawesome.com/), which are included in `index.html`.

## Library Usage Rules

To maintain consistency and simplicity, please adhere to the following rules:

-   **Mind Map Functionality:**
    -   For all operations related to creating, updating, or deleting nodes and edges, use the hooks provided by `@xyflow/react` (e.g., `useReactFlow`, `useNodesState`, `useEdgesState`).
    -   Custom node behavior and appearance should be implemented by creating custom node components (like `InteractiveNode.tsx`).

-   **State Management:**
    -   Use React's built-in hooks (`useState`, `useRef`, `useCallback`, etc.) for managing local component state.
    -   The state of the nodes and edges is managed by `@xyflow/react`'s internal state manager, accessed via its hooks. Avoid creating a separate global state for them.

-   **Layouting:**
    -   All automatic node positioning and layout adjustments must be handled through the `useLayoutNodes` hook, which utilizes the `dagre` library. Do not implement custom layout logic elsewhere.

-   **Styling:**
    -   All styles should be added to `src/App.css`.
    -   Use CSS classes for styling components. Avoid inline styles unless they are required for dynamic properties that cannot be handled by classes.

-   **Icons:**
    -   Use the `<span className="material-symbols-outlined">icon_name</span>` syntax for Material Symbols.
    -   Use the `<i className="fa-solid fa-icon-name"></i>` syntax for Font Awesome icons.

-   **File Operations:**
    -   For exporting and importing mind maps, use the existing utility functions in `src/utils/fileOperations.ts`, which leverage the browser's File System Access API.