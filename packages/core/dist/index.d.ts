/**
 * @file Defines the core data schemas and interfaces for the Open Variant Browser.
 */
/**
 * A canonical representation of a genomic feature.
 * This interface is used internally to represent variants, genes, and other track data
 * in a standardized format.
 */
interface Feature {
    id: string;
    refName: string;
    start: number;
    end: number;
    type: 'variant' | 'gene' | 'exon' | 'coverage' | 'sv' | string;
    subType?: string;
    score?: number;
    strand?: 1 | -1 | 0;
    data: Record<string, unknown>;
}
/**
 * Defines a genomic region.
 */
interface Region {
    refName: string;
    start: number;
    end: number;
}
/**
 * Options for fetching data from an adapter.
 */
interface FetchOptions {
    signal?: AbortSignal;
    resolution?: number;
}
/**
 * The contract for a data adapter.
 * Data adapters are responsible for fetching and parsing data from various sources
 * (e.g., VCF.gz, BigWig, GFF3) and converting it into the canonical `Feature` format.
 */
interface DataAdapter {
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

export type { DataAdapter, Feature, FetchOptions, Region };
