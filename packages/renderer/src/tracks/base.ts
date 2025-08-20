/**
 * @file Abstract base class for all tracks.
 */
import type { DataAdapter, Feature } from '@ovb/core';
import { Viewport } from '../viewport';

export interface TrackOptions {
  id: string;
  name: string;
  adapter: DataAdapter;
}

export abstract class Track {
  public id: string;
  public name: string;
  public adapter: DataAdapter;
  public height: number = 50; // Default height in pixels

  constructor(options: TrackOptions) {
    this.id = options.id;
    this.name = options.name;
    this.adapter = options.adapter;
  }

  /**
   * Computes the layout of features for the current viewport.
   * This could involve fetching data, calculating positions, etc.
   * @param viewport The current viewport.
   */
  public abstract layout(viewport: Viewport): Promise<void>;

  /**
   * Renders the track's features onto the canvas.
   * @param ctx The canvas rendering context.
   * @param viewport The current viewport.
   */
  public abstract render(ctx: CanvasRenderingContext2D, viewport: Viewport): void;

  /**
   * Optional method for hit-testing (e.g., for tooltips).
   * @param x The canvas x-coordinate.
   * @param y The canvas y-coordinate.
   * @returns The feature at the given coordinates, or null if none.
   */
  public hitTest?(x: number, y: number): Feature | null;

  /**
   * Optional method to clean up resources.
   */
  public destroy?(): void;
}
