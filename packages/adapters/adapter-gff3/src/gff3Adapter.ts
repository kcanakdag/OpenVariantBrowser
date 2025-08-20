/**
 * @file Data adapter for GFF3 files.
 */
import type { DataAdapter, Feature, Region, FetchOptions } from '@ovb/core';

interface Gff3AdapterOptions {
  url: string;
  indexUrl: string; // Assuming a Tabix-indexed GFF3
}

/**
 * Adapter for fetching gene/exon data from a GFF3 file.
 */
export class Gff3Adapter implements DataAdapter {
  private options: Gff3AdapterOptions;

  constructor(options: Gff3AdapterOptions) {
    this.options = options;
  }

  public async init(): Promise<void> {
    console.log(`Initializing GFF3 adapter for: ${this.options.url}`);
    return Promise.resolve();
  }

  /**
   * MOCKED IMPLEMENTATION
   */
  public async *getFeatures(region: Region, opts?: FetchOptions): AsyncIterable<Feature> {
    console.log(`Fetching GFF3 features for region: ${region.refName}:${region.start}-${region.end}`);

    // A real implementation would use a Tabix index to fetch chunks,
    // decompress, and parse GFF3 lines.

    // For now, yield a few hardcoded genes and exons.
    const mockFeatures: Feature[] = [
      // Gene A
      {
        id: 'gene-A',
        refName: region.refName,
        start: region.start + 200,
        end: region.start + 900,
        type: 'gene',
        strand: 1,
        data: { Name: 'GENE_A', ID: 'gene-A' },
      },
      {
        id: 'gene-A-exon-1',
        refName: region.refName,
        start: region.start + 200,
        end: region.start + 350,
        type: 'exon',
        strand: 1,
        data: { Parent: 'gene-A' },
      },
      {
        id: 'gene-A-exon-2',
        refName: region.refName,
        start: region.start + 500,
        end: region.start + 600,
        type: 'exon',
        strand: 1,
        data: { Parent: 'gene-A' },
      },
      {
        id: 'gene-A-exon-3',
        refName: region.refName,
        start: region.start + 800,
        end: region.start + 900,
        type: 'exon',
        strand: 1,
        data: { Parent: 'gene-A' },
      },
      // Gene B (opposite strand)
      {
        id: 'gene-B',
        refName: region.refName,
        start: region.start + 1200,
        end: region.start + 1800,
        type: 'gene',
        strand: -1,
        data: { Name: 'GENE_B', ID: 'gene-B' },
      },
      {
        id: 'gene-B-exon-1',
        refName: region.refName,
        start: region.start + 1600,
        end: region.start + 1800,
        type: 'exon',
        strand: -1,
        data: { Parent: 'gene-B' },
      },
    ];

    for (const feature of mockFeatures) {
      if (feature.start < region.end && feature.end > region.start) {
        yield feature;
      }
    }
  }
}
