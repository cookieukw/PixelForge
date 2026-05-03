import { useRef, useCallback, useState } from "react";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Toast } from "@capacitor/toast";
import { Capacitor } from "@capacitor/core";

/** Frames recorded for the GIF (≈1 s at 60fps display rate) */
const GIF_FRAMES = 60;

// ─── Synchronous single-frame capture ────────────────────────────────────────
//
// This runs inside a requestAnimationFrame callback so it MUST be synchronous.
// We read getComputedStyle() + transform at the exact moment the browser has
// finished painting, then replay them on an OffscreenCanvas.

function captureFrameNow(
    img: HTMLImageElement,
    resolutionScale: number,
    backgroundColor: string
): ImageBitmap | null {
    if (!img.naturalWidth || !img.naturalHeight) return null;
    if (!img.offsetWidth || !img.offsetHeight) return null;

    const w = Math.round(img.naturalWidth * resolutionScale);
    const h = Math.round(img.naturalHeight * resolutionScale);

    // Ratio from CSS-pixel layout size → canvas output size
    const scaleX = w / img.offsetWidth;
    const scaleY = h / img.offsetHeight;

    const style = window.getComputedStyle(img);
    const transformStr = style.transform; // e.g. "matrix(1.1, 0, 0, 1.1, 0, 0)"
    const opacity = parseFloat(style.opacity ?? "1");

    const offscreen = new OffscreenCanvas(w, h);
    const ctx = offscreen.getContext("2d") as OffscreenCanvasRenderingContext2D;
    if (!ctx) return null;

    if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
    }

    ctx.save();
    ctx.globalAlpha = isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
    ctx.imageSmoothingEnabled = false;

    // Replay CSS transform around its origin (centre of element)
    if (transformStr && transformStr !== "none") {
        try {
            const m = new DOMMatrix(transformStr);
            const cx = w / 2;
            const cy = h / 2;
            ctx.translate(cx, cy);
            // Scale the translation components (m41/m42) from CSS-px → canvas-px
            ctx.transform(m.a, m.b, m.c, m.d, m.m41 * scaleX, m.m42 * scaleY);
            ctx.translate(-cx, -cy);
        } catch {
            // Ignore transforms we can't parse (rare 3-D-only cases)
        }
    }

    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();

    return offscreen.transferToImageBitmap(); // synchronous transfer
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSpriteCapture = (
    backgroundColor: string = "transparent",
    imgRef?: React.RefObject<HTMLImageElement>,
    t: (key: string, vars?: Record<string, string | number>) => string = (k) => k
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [resolutionScale, setResolutionScale] = useState<0.5 | 1 | 2 | 4>(1);
    const [frameCount, setFrameCount] = useState<number>(20);

    // ── RAF-based capture ──────────────────────────────────────────────────────
    // Captures `totalFrames` frames in sync with the browser's paint loop.
    // Returns the captured bitmaps + the real inter-frame delay in ms so we
    // can use the actual measured display rate as the GIF delay.

    const captureViaRAF = useCallback(
        (totalFrames: number): Promise<{ frames: ImageBitmap[]; delayMs: number }> => {
            return new Promise((resolve) => {
                const frames: ImageBitmap[] = [];
                const intervals: number[] = [];
                let lastTs: number | null = null;

                setIsExporting(true);
                setExportProgress(0);

                const tick = (ts: number) => {
                    if (lastTs !== null) intervals.push(ts - lastTs);
                    lastTs = ts;

                    const img = imgRef?.current;
                    if (img) {
                        const bmp = captureFrameNow(img, resolutionScale, backgroundColor);
                        if (bmp) frames.push(bmp);
                    }

                    const pct = (frames.length / totalFrames) * 100;
                    setExportProgress(pct);

                    if (frames.length < totalFrames) {
                        requestAnimationFrame(tick);
                    } else {
                        setIsExporting(false);
                        // Average measured interval; GIF min is ~10ms (1 centisecond)
                        const avg = intervals.length
                            ? intervals.reduce((a, b) => a + b, 0) / intervals.length
                            : 1000 / 60;
                        resolve({ frames, delayMs: Math.max(10, Math.round(avg)) });
                    }
                };

                requestAnimationFrame(tick);
            });
        },
        [imgRef, resolutionScale, backgroundColor]
    );

    // ── setTimeout-based capture (OBSOLETE for main exports, kept for internal ref) ──

    const captureViaTimeout = useCallback(
        (totalFrames: number, intervalMs: number): Promise<ImageBitmap[]> => {
            return new Promise(async (resolve) => {
                const frames: ImageBitmap[] = [];
                setIsExporting(true);
                setExportProgress(0);

                for (let i = 0; i < totalFrames; i++) {
                    await new Promise(r => setTimeout(r, intervalMs));
                    const img = imgRef?.current;
                    if (img) {
                        const bmp = captureFrameNow(img, resolutionScale, backgroundColor);
                        if (bmp) frames.push(bmp);
                    }
                    setExportProgress(((i + 1) / totalFrames) * 100);
                }

                setIsExporting(false);
                resolve(frames);
            });
        },
        [imgRef, resolutionScale, backgroundColor]
    );

    // ── Helper: download on web / save on mobile ───────────────────────────────

    const saveFile = useCallback(
        async (data: string | Uint8Array, fileName: string, mimeType: string) => {
            if (Capacitor.getPlatform() === "web") {
                const href =
                    typeof data === "string"
                        ? data
                        : URL.createObjectURL(new Blob([data], { type: mimeType }));
                const link = document.createElement("a");
                link.download = fileName;
                link.href = href;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                if (typeof data !== "string") URL.revokeObjectURL(href);
                return;
            }

            try {
                const base64 =
                    typeof data === "string"
                        ? data.split(",")[1]
                        : btoa(String.fromCharCode(...data));
                await Filesystem.writeFile({
                    path: fileName,
                    data: base64,
                    directory: Directory.Documents,
                });
                await Toast.show({
                    text: t("alerts.savedAt", { path: `${Directory.Documents}/${fileName}` }),
                    duration: "long",
                });
            } catch (error) {
                console.error("Erro ao salvar:", error);
                await Toast.show({
                    text: t("alerts.saveError"),
                    duration: "long",
                });
            }
        },
        []
    );

    // ── Export: PNG Spritesheet ────────────────────────────────────────────────

    const exportSpritesheet = useCallback(async () => {
        if (!canvasRef.current) return;

        // Use high-precision RAF capture for the spritesheet as well.
        const { frames } = await captureViaRAF(frameCount);

        if (!frames.length) {
            alert(t("alerts.noFrames"));
            return;
        }
        const [first] = frames;
        const frameW = first.width;
        const frameH = first.height;

        const canvas = canvasRef.current;
        canvas.width = frameW * frames.length;
        canvas.height = frameH;

        const ctx = canvas.getContext("2d", { willReadFrequently: false })!;

        if (backgroundColor !== "transparent") {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        frames.forEach((frame, i) => {
            ctx.drawImage(frame, i * frameW, 0, frameW, frameH);
            frame.close();
        });

        const dataUrl = canvas.toDataURL("image/png");
        await saveFile(dataUrl, `spritesheet-${Date.now()}.png`, "image/png");
    }, [captureViaRAF, frameCount, backgroundColor, saveFile]);

    // ── Export: Animated GIF at ~60fps ────────────────────────────────────────
    //
    // GIF stores delays in centiseconds (1/100 s), so 16.67ms → 1.667cs → 2cs
    // = 20ms = 50fps effective. That's the GIF format's maximum practical rate.

    const exportGif = useCallback(async () => {
        const { frames, delayMs } = await captureViaRAF(GIF_FRAMES);

        if (!frames.length) {
            alert(t("alerts.noFrames"));
            return;
        }

        setIsExporting(true);
        setExportProgress(0);

        try {
            const { width: frameW, height: frameH } = frames[0];
            const gif = GIFEncoder();

            const tmp = document.createElement("canvas");
            tmp.width = frameW;
            tmp.height = frameH;
            const tmpCtx = tmp.getContext("2d")!;

            for (let i = 0; i < frames.length; i++) {
                tmpCtx.clearRect(0, 0, frameW, frameH);
                tmpCtx.drawImage(frames[i], 0, 0);
                const { data: rgba } = tmpCtx.getImageData(0, 0, frameW, frameH);

                const palette = quantize(rgba, 256);
                const index = applyPalette(rgba, palette);

                gif.writeFrame(index, frameW, frameH, {
                    palette,
                    delay: delayMs, // measured real display interval
                    repeat: 0,      // loop forever
                });

                frames[i].close();
                setExportProgress(((i + 1) / frames.length) * 100);
            }

            gif.finish();
            await saveFile(gif.bytes(), `animation-${Date.now()}.gif`, "image/gif");
        } catch (err) {
            console.error("[useSpriteCapture] Erro ao gerar GIF:", err);
            alert(t("alerts.gifError"));
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    }, [captureViaRAF, saveFile]);

    // ── Preview info ───────────────────────────────────────────────────────────

    const getExpectedOutputSize = useCallback(() => {
        const img = imgRef?.current;
        if (!img || !img.naturalWidth) return null;
        return {
            frameW: Math.round(img.naturalWidth * resolutionScale),
            frameH: Math.round(img.naturalHeight * resolutionScale),
            totalW: Math.round(img.naturalWidth * resolutionScale) * frameCount,
            totalH: Math.round(img.naturalHeight * resolutionScale),
        };
    }, [imgRef, resolutionScale, frameCount]);

    return {
        canvasRef,
        exportSpritesheet,
        exportGif,
        isExporting,
        exportProgress,
        resolutionScale,
        setResolutionScale,
        frameCount,
        setFrameCount,
        getExpectedOutputSize,
    };
};
