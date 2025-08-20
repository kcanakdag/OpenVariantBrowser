/**
 * @file Renderer for a gene track.
 */
import type { Feature } from '@ovb/core';
import { Viewport } from '../viewport';
import { Track, type TrackOptions } from './base';

interface LaidOutFeature {
  feature: Feature;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class GeneTrack extends Track {
  private laidOutFeatures: LaidOutFeature[] = [];

  constructor(options: TrackOptions) {
    super(options);
    this.height = 100; // Genes can have more complex layouts
  }

  public async layout(viewport: Viewport): Promise<void> {
    const features = this.adapter.getFeatures({
      refName: 'chr1', // This should come from the viewport/browser state
      start: viewport.genomicStart,
      end: viewport.genomicEnd,
    });

    const newLaidOutFeatures: LaidOutFeature[] = [];
    const yPos = 20; // Base y-position for the track content
    const exonHeight = 10;
    const intronHeight = 2;

    for await (const feature of features) {
      const startX = viewport.genomicToPixel(feature.start);
      const endX = viewport.genomicToPixel(feature.end);
      const width = Math.max(1, endX - startX);

      if (feature.type === 'gene') {
        // Render intron line
        newLaidOutFeatures.push({
          feature,
          x: startX,
          y: yPos + exonHeight / 2 - intronHeight / 2,
          width: width,
          height: intronHeight,
        });
      } else if (feature.type === 'exon') {
        // Render exon box
        newLaidOutFeatures.push({
          feature,
          x: startX,
          y: yPos,
          width: width,
          height: exonHeight,
        });
      }
    }
    this.laidOutFeatures = newLaidOutFeatures;
  }

  public render(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    ctx.fillStyle = '#00008B'; // Dark Blue
    ctx.strokeStyle = '#000000';
    ctx.font = '12px sans-serif';

    // Draw track title
    ctx.fillText(this.name, 5, 15);

    for (const lo of this.laidOutFeatures) {
      ctx.fillRect(lo.x, lo.y, lo.width, lo.height);

      // Draw gene name
      if (lo.feature.type === 'gene') {
        const geneName = lo.feature.data?.Name as string || lo.feature.id;
        ctx.fillText(geneName, lo.x, lo.y + 30);
      }
    }
  }
}
