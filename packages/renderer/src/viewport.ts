/**
 * @file Manages the mapping between genomic coordinates and canvas pixel coordinates.
 */

/**
 * Represents the visible portion of the genome.
 */
export class Viewport {
  private canvas: HTMLCanvasElement;
  public genomicStart: number;
  public genomicEnd: number;

  /**
   * @param canvas The HTML canvas element to render on.
   * @param initialGenomicStart The initial starting genomic coordinate (0-based).
   * @param initialGenomicEnd The initial ending genomic coordinate.
   */
  constructor(canvas: HTMLCanvasElement, initialGenomicStart: number, initialGenomicEnd: number) {
    this.canvas = canvas;
    this.genomicStart = initialGenomicStart;
    this.genomicEnd = initialGenomicEnd;
  }

  /**
   * The width of the canvas in pixels.
   */
  get canvasWidth(): number {
    return this.canvas.width;
  }

  /**
   * The height of the canvas in pixels.
   */
  get canvasHeight(): number {
    return this.canvas.height;
  }

  /**
   * The length of the visible genomic region in base pairs.
   */
  get genomicRange(): number {
    return this.genomicEnd - this.genomicStart;
  }

  /**
   * The number of base pairs per pixel.
   */
  get bpPerPixel(): number {
    return this.genomicRange / this.canvasWidth;
  }

  /**
   * Converts a genomic coordinate to a horizontal pixel position on the canvas.
   * @param genomicPosition The genomic coordinate.
   * @returns The x-coordinate on the canvas.
   */
  genomicToPixel(genomicPosition: number): number {
    if (genomicPosition < this.genomicStart || genomicPosition > this.genomicEnd) {
      return -1; // Off-screen
    }
    const relativeGenomicPos = genomicPosition - this.genomicStart;
    return (relativeGenomicPos / this.genomicRange) * this.canvasWidth;
  }

  /**
   * Pans the viewport by a given number of pixels.
   * @param pixelDelta The number of pixels to pan (positive for right, negative for left).
   */
  pan(pixelDelta: number): void {
    const genomicDelta = Math.round(pixelDelta * this.bpPerPixel);
    this.genomicStart += genomicDelta;
    this.genomicEnd += genomicDelta;
  }

  /**
   * Zooms the viewport in or out, centered on a specific pixel coordinate.
   * @param factor The zoom factor (e.g., 1.1 for 10% zoom in, 0.9 for 10% zoom out).
   * @param centerX The pixel x-coordinate to zoom around.
   */
  zoom(factor: number, centerX: number): void {
    const centerGenomic = this.genomicStart + (centerX * this.bpPerPixel);
    const newRange = this.genomicRange / factor;

    this.genomicStart = Math.round(centerGenomic - (centerX / this.canvasWidth) * newRange);
    this.genomicEnd = Math.round(this.genomicStart + newRange);
  }
}
