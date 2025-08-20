/**
 * Manages the canvas, viewport, and rendering loop.
 */
declare class Renderer {
    private canvas;
    private ctx;
    private viewport;
    private animationFrameId;
    /**
     * @param mountElement The HTML element to mount the canvas in.
     * @param initialLocus The initial genomic locus to display (e.g., "chr1:1000-2000").
     */
    constructor(mountElement: HTMLElement, initialLocus: string);
    /**
     * Adjusts canvas resolution for high-DPI displays.
     */
    private resize;
    /**
     * Starts the rendering loop.
     */
    start(): void;
    /**
     * Stops the rendering loop.
     */
    stop(): void;
    /**
     * The main rendering loop.
     */
    private renderLoop;
    /**
     * Draws all components for the current frame.
     */
    private draw;
    /**
     * Draws the main genome axis and ticks.
     */
    private drawAxis;
}

/**
 * @file Manages the mapping between genomic coordinates and canvas pixel coordinates.
 */
/**
 * Represents the visible portion of the genome.
 */
declare class Viewport {
    private canvas;
    genomicStart: number;
    genomicEnd: number;
    /**
     * @param canvas The HTML canvas element to render on.
     * @param initialGenomicStart The initial starting genomic coordinate (0-based).
     * @param initialGenomicEnd The initial ending genomic coordinate.
     */
    constructor(canvas: HTMLCanvasElement, initialGenomicStart: number, initialGenomicEnd: number);
    /**
     * The width of the canvas in pixels.
     */
    get canvasWidth(): number;
    /**
     * The height of the canvas in pixels.
     */
    get canvasHeight(): number;
    /**
     * The length of the visible genomic region in base pairs.
     */
    get genomicRange(): number;
    /**
     * The number of base pairs per pixel.
     */
    get bpPerPixel(): number;
    /**
     * Converts a genomic coordinate to a horizontal pixel position on the canvas.
     * @param genomicPosition The genomic coordinate.
     * @returns The x-coordinate on the canvas.
     */
    genomicToPixel(genomicPosition: number): number;
    /**
     * Pans the viewport by a given number of pixels.
     * @param pixelDelta The number of pixels to pan (positive for right, negative for left).
     */
    pan(pixelDelta: number): void;
    /**
     * Zooms the viewport in or out, centered on a specific pixel coordinate.
     * @param factor The zoom factor (e.g., 1.1 for 10% zoom in, 0.9 for 10% zoom out).
     * @param centerX The pixel x-coordinate to zoom around.
     */
    zoom(factor: number, centerX: number): void;
}

export { Renderer, Viewport };
