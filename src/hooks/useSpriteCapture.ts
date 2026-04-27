import { useRef, useCallback, useState } from "react";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Toast } from "@capacitor/toast";
import { Capacitor } from "@capacitor/core";

const TOTAL_FRAMES = 10;
const CAPTURE_INTERVAL = 150;

export const useSpriteCapture = (
    backgroundColor: string = "transparent",
    imgRef?: React.RefObject<HTMLImageElement>
) => {
    const framesRef = useRef<ImageBitmap[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [resolutionScale, setResolutionScale] = useState<0.5 | 1 | 2 | 4>(1);

    /**
     * Captura um único frame da imagem atual usando Canvas API nativa.
     * Usa as dimensões reais do sprite (naturalWidth × naturalHeight × scale),
     * não o tamanho visual do container CSS.
     */
    const captureFrame = useCallback(async (): Promise<ImageBitmap | null> => {
        const img = imgRef?.current;
        if (!img || !img.naturalWidth || !img.naturalHeight) return null;

        const w = Math.round(img.naturalWidth * resolutionScale);
        const h = Math.round(img.naturalHeight * resolutionScale);

        const offscreen = new OffscreenCanvas(w, h);
        const ctx = offscreen.getContext("2d") as OffscreenCanvasRenderingContext2D;
        if (!ctx) return null;

        if (backgroundColor !== "transparent") {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, w, h);
        } else {
            ctx.clearRect(0, 0, w, h);
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, w, h);

        return offscreen.transferToImageBitmap();
    }, [imgRef, resolutionScale, backgroundColor]);

    const captureFramesForExport = useCallback(async () => {
        framesRef.current = [];
        setIsExporting(true);
        setExportProgress(0);

        try {
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const frame = await captureFrame();
                if (frame) {
                    framesRef.current.push(frame);
                }
                setExportProgress(((i + 1) / TOTAL_FRAMES) * 100);
                await new Promise(resolve => setTimeout(resolve, CAPTURE_INTERVAL));
            }
        } catch (err) {
            console.error("[useSpriteCapture] Erro ao capturar frames:", err);
        } finally {
            setIsExporting(false);
        }
    }, [captureFrame]);

    const exportSpritesheet = useCallback(async () => {
        await captureFramesForExport();

        if (!framesRef.current.length || !canvasRef.current) {
            alert("Nenhum frame capturado! Carregue um sprite primeiro.");
            return;
        }

        const frames = framesRef.current;
        const [first] = frames;
        const frameW = first.width;
        const frameH = first.height;

        const canvas = canvasRef.current;
        canvas.width = frameW * frames.length;
        canvas.height = frameH;

        const ctx = canvas.getContext("2d", { willReadFrequently: false });
        if (!ctx) return;

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
        framesRef.current = [];

        const dataUrl = canvas.toDataURL("image/png");
        const fileName = `spritesheet-${Date.now()}.png`;

        if (Capacitor.getPlatform() === "web") {
            const link = document.createElement("a");
            link.download = fileName;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        try {
            const base64Data = dataUrl.split(",")[1];
            await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Documents,
            });
            await Toast.show({
                text: `Arquivo salvo em: ${Directory.Documents}/${fileName}`,
                duration: "long"
            });
        } catch (error) {
            console.error("Erro ao salvar:", error);
            await Toast.show({
                text: "Erro ao salvar o arquivo! Verifique as permissões.",
                duration: "long"
            });
        }
    }, [captureFramesForExport, backgroundColor]);

    /** Dimensões de saída esperadas para o spritesheet (útil para exibir na UI) */
    const getExpectedOutputSize = useCallback(() => {
        const img = imgRef?.current;
        if (!img || !img.naturalWidth) return null;
        return {
            frameW: Math.round(img.naturalWidth * resolutionScale),
            frameH: Math.round(img.naturalHeight * resolutionScale),
            totalW: Math.round(img.naturalWidth * resolutionScale) * TOTAL_FRAMES,
            totalH: Math.round(img.naturalHeight * resolutionScale),
        };
    }, [imgRef, resolutionScale]);

    return {
        canvasRef,
        exportSpritesheet,
        isExporting,
        exportProgress,
        resolutionScale,
        setResolutionScale,
        getExpectedOutputSize,
    };
};
