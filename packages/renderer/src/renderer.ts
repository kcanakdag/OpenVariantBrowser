/**
 * @file The main Canvas 2D rendering engine.
 */
import { Viewport } from './viewport';
import { Track } from './tracks/base';

/**
 * Manages the canvas, viewport, tracks, and rendering loop.
 */
export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private viewport: Viewport;
  private tracks: Track[] = [];
  private animationFrameId: number | null = null;

  /**
   * @param mountElement The HTML element to mount the canvas in.
   * @param initialLocus The initial genomic locus to display (e.g., "chr1:1000-2000").
   */
  constructor(mountElement: HTMLElement, initialLocus: string) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '500px'; // A bit taller to see tracks
    mountElement.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D rendering context');
    }
    this.ctx = ctx;

    // Handle high-DPI displays
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));

    const [refName, rangeStr] = initialLocus.split(':');
    if (!rangeStr) {
      throw new Error(`Invalid locus string: ${initialLocus}`);
    }
    const [startStr, endStr] = rangeStr.split('-');
    if (startStr === undefined || endStr === undefined) {
      throw new Error(`Invalid range in locus string: ${initialLocus}`);
    }
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);

    if (isNaN(start) || isNaN(end)) {
      throw new Error(`Invalid range in locus string: ${initialLocus}`);
    }

    this.viewport = new Viewport(this.canvas, start, end);

    this.start();
  }

  /**
   * Adds a track to the renderer.
   * @param track The track to add.
   */
  public addTrack(track: Track): void {
    this.tracks.push(track);
    // Trigger a re-layout when a new track is added
    this.layoutAllTracks();
  }

  /**
   * Adjusts canvas resolution for high-DPI displays.
   */
  private resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Starts the rendering loop.
   */
  public start(): void {
    if (this.animationFrameId) {
      this.stop();
    }
    this.renderLoop();
  }

  /**
   * Stops the rendering loop.
   */
  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * The main rendering loop.
   */
  private renderLoop(): void {
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.renderLoop.bind(this));
  }

  /**
   * Asynchronously lays out all tracks.
   */
  private async layoutAllTracks(): Promise<void> {
    for (const track of this.tracks) {
      await track.layout(this.viewport);
    }
  }

  /**
   * Draws all components for the current frame.
   */
  private draw(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // Draw genome axis
    this.drawAxis();

    // Draw tracks
    let yOffset = 50; // Start drawing tracks below the axis
    for (const track of this.tracks) {
      this.ctx.save();
      this.ctx.translate(0, yOffset);
      track.render(this.ctx, this.viewport);
      this.ctx.restore();
      yOffset += track.height;
    }
  }

  /**
   * Draws the main genome axis and ticks.
   */
  private drawAxis(): void {
    const y = 30; // Vertical position of the axis
    const width = this.viewport.canvasWidth;

    // Draw axis line
    this.ctx.beginPath();
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(width, y);
    this.ctx.strokeStyle = '#333';
    this.ctx.stroke();

    // Draw ticks (a simple example)
    const tickCount = 10;
    const tickSpacing = width / tickCount;
    this.ctx.font = '10px sans-serif';
    this.ctx.fillStyle = '#333';
    this.ctx.textAlign = 'center';

    for (let i = 0; i <= tickCount; i++) {
      const x = i * tickSpacing;
      const genomicPos = this.viewport.genomicStart + (i / tickCount) * this.viewport.genomicRange;

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, y - 5);
      this.ctx.stroke();

      this.ctx.fillText(Math.round(genomicPos).toLocaleString(), x, y - 10);
    }
  }
}
