declare module "gifenc" {
    export interface GIFEncoderOptions {
        initialCapacity?: number;
        auto?: boolean;
    }

    export interface WriteFrameOptions {
        /** Palette for this frame (256 colors × 3 channels) */
        palette?: Uint8Array;
        /** Frame delay in centiseconds (1/100 s). Default: 0 */
        delay?: number;
        /** Number of times to repeat (0 = infinite). Default: 0 */
        repeat?: number;
        /** Transparent color index in the palette, or -1 for none */
        transparent?: number;
        /** Whether to use local palette instead of global */
        useLocalPalette?: boolean;
    }

    export interface GIFEncoder {
        writeFrame(
            indexedPixels: Uint8Array,
            width: number,
            height: number,
            opts?: WriteFrameOptions
        ): void;
        finish(): void;
        /** Returns the encoded bytes as a Uint8Array */
        bytes(): Uint8Array;
        /** Returns the byte length so far */
        bytesView(): Uint8Array;
    }

    /** Creates a new GIF encoder */
    export function GIFEncoder(opts?: GIFEncoderOptions): GIFEncoder;

    /**
     * Quantizes RGBA pixels to at most `maxColors` palette entries.
     * @param rgba  Flat Uint8ClampedArray of [R,G,B,A, R,G,B,A, ...]
     * @param maxColors  Max palette size (≤ 256)
     * @param opts  Optional config
     * @returns Uint8Array of shape [maxColors * 3] (RGB triples)
     */
    export function quantize(
        rgba: Uint8ClampedArray | Uint8Array,
        maxColors: number,
        opts?: { format?: "rgb565" | "rgb444" | "rgba4444" | "rgb" }
    ): Uint8Array;

    /**
     * Maps each pixel in `rgba` to the nearest index in `palette`.
     * @returns Uint8Array of length (width * height)
     */
    export function applyPalette(
        rgba: Uint8ClampedArray | Uint8Array,
        palette: Uint8Array,
        format?: string
    ): Uint8Array;
}
