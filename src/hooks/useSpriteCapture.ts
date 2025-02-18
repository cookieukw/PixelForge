import { useRef, useCallback, useState } from "react";
import html2canvas from "html2canvas";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { Platform } from '@capacitor/core';


const TOTAL_FRAMES = 10;
const CAPTURE_INTERVAL = 150;

export const useSpriteCapture = () => {
    const framesRef = useRef<ImageData[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [resolutionScale, setResolutionScale] = useState<0.5 | 1 | 2 | 4>(1);

    const captureFramesForExport = useCallback(async () => {
        framesRef.current = [];
        setIsExporting(true);
        setExportProgress(0);

        try {
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const preview = document.getElementById("sprite-preview");
                if (!preview) continue;

                const capturedCanvas = await html2canvas(preview, {
                    backgroundColor:
                        backgroundColor === "transparent"
                            ? null
                            : backgroundColor,
                    scale: resolutionScale,
                    useCORS: true
                });

                const ctx = capturedCanvas.getContext("2d");
                if (!ctx) continue;

                const imageData = ctx.getImageData(
                    0,
                    0,
                    capturedCanvas.width,
                    capturedCanvas.height
                );

                framesRef.current.push(imageData);
                setExportProgress(((i + 1) / TOTAL_FRAMES) * 100);
                await new Promise(resolve =>
                    setTimeout(resolve, CAPTURE_INTERVAL)
                );
            }
        } finally {
            setIsExporting(false);
        }
    }, [resolutionScale]);

    const exportSpritesheet = useCallback(async () => {
        await captureFramesForExport();

        if (!framesRef.current.length || !canvasRef.current) {
            alert("Nenhum frame capturado!");
            return;
        }

        const canvas = canvasRef.current;
        // ... código de montagem do canvas

        const dataUrl = canvas.toDataURL("image/png");
        const fileName = `spritesheet-${Date.now()}.png`;

        // Plataforma web
        if (Platform.isNativePlatform === false) {
            const link = document.createElement("a");
            link.download = fileName;
            link.href = dataUrl;
            link.click();
            return;
        }

        // Plataforma mobile (Capacitor)
        try {
            const blob = await (await fetch(dataUrl)).blob();
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const result = await Filesystem.writeFile({
                path: `Documents/${fileName}`,
                data: btoa(String.fromCharCode(...uint8Array)),
                directory: Directory.Documents,
                encoding: "base64"
            });

            await Toast.show({
                text: `Arquivo salvo em: ${result.uri}`,
                duration: "long"
            });
        } catch (error) {
            await Toast.show({
                text: `Erro ao salvar: ${error.message}`,
                duration: "long"
            });
        }
    }, [captureFramesForExport, resolutionScale]);

    return {
        canvasRef,
        exportSpritesheet,
        isExporting,
        exportProgress,
        resolutionScale,
        setResolutionScale
    };
};
