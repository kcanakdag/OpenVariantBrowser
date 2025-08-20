# Open Variant Browser

A framework-agnostic, embeddable JavaScript variant browser for the web.

This is the monorepo for the Open Variant Browser (OVB) project, managed with [pnpm](httpss://pnpm.io/) and [Turborepo](https://turbo.build/repo).

## Vision

- **Embed anywhere**: works as a Web Component (`<ovb-browser>`), plain JS API, and thin React/Vue wrappers.
- **Zero-backend by default**: runs fully client-side with HTTP range requests.
- **Performance first**: 60 fps target, chunked/tiled data loading, workers + OffscreenCanvas.
- **Privacy-aware**: local files never uploaded; no analytics by default.
- **Interoperable**: GA4GH/VCF ecosystem; pluggable format adapters.
- **Accessible & themable**: keyboard navigation, high-contrast mode, CSS variables.
- **Small, modular core**: headless rendering + minimal UI primitives; everything else via plugins/adapters.

## Getting Started

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Build all packages:**
    ```bash
    pnpm turbo build
    ```

3.  **Run a development server (e.g., for the docs app):**
    ```bash
    pnpm turbo dev --filter=docs
    ```

## Monorepo Structure

-   `apps/`: Contains example and documentation applications.
    -   `docs`: The main documentation site.
-   `packages/`: Contains the core libraries and components.
    -   `@ovb/core`: Core state, models, event bus, and feature schema.
    -   `@ovb/renderer`: Canvas/WebGL rendering engine.
    -   `@ovb/ui`: Headless UI primitives and the default theme.
    -   `@ovb/web`: The main Web Component wrapper (`<ovb-browser>`).
    -   `@ovb/react` / `@ovb/vue`: Thin wrappers for React and Vue.
    -   `@ovb/adapters-*`: Data adapters for various file formats (VCF, BigWig, etc.).
    -   `@ovb/devkit`: Development tools, Storybook stories, and test fixtures.
