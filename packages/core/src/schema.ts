/**
 * @file Defines the core data schemas and interfaces for the Open Variant Browser.
 */

/**
 * A canonical representation of a genomic feature.
 * This interface is used internally to represent variants, genes, and other track data
 * in a standardized format.
 */
export interface Feature {
  id: string;               // stable key (e.g., CHR:POS:REF:ALT)
  refName: string;          // e.g., "chr1"
  start: number;            // 0-based inclusive
  end: number;              // 0-based exclusive
  type: 'variant'|'gene'|'exon'|'coverage'|'sv'|string;
  subType?: string;         // e.g., 'DEL','INS', consequence term, etc.
  score?: number;           // QUAL or similar
  strand?: 1|-1|0;          // 1 for forward, -1 for reverse, 0 for not applicable
  data: Record<string, unknown>;  // raw attrs, INFO, FORMAT, gene attrs
}

/**
 * Defines a genomic region.
 */
export interface Region {
  refName: string;
  start: number;
  end: number;
}

/**
 * Options for fetching data from an adapter.
 */
export interface FetchOptions {
  signal?: AbortSignal;
  resolution?: number; // For downsampling, e.g., in coverage tracks
}

/**
 * The contract for a data adapter.
 * Data adapters are responsible for fetching and parsing data from various sources
 * (e.g., VCF.gz, BigWig, GFF3) and converting it into the canonical `Feature` format.
 */
export interface DataAdapter {
  /**
   * Initializes resources like file handles or remote connections.
   * Called once when the adapter is attached to a track.
   */
  init(): Promise<void>;

  /**
   * Streams features within a given genomic region.
   * This method should be an async generator, yielding features as they become available.
   * @param region The genomic region to fetch features for.
   * @param opts Additional options, including an AbortSignal for cancellation.
   */
  getFeatures(region: Region, opts?: FetchOptions): AsyncIterable<Feature>;

  /**
   * Returns header information or metadata from the data source.
   * Useful for populating track legends, sample lists, etc.
   */
  getHeader?(): Promise<Record<string, unknown>>;

  /**
   * Frees any held resources like file handles or caches.
   * Called when the track is removed or the browser is destroyed.
   */
  close?(): Promise<void>;
}
