import { useRef, useCallback, useState } from "react";
import html2canvas from "html2canvas";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Toast } from "@capacitor/toast";
import { Capacitor } from "@capacitor/core";

const TOTAL_FRAMES = 10;
const CAPTURE_INTERVAL = 150;

export const useSpriteCapture = (backgroundColor: string = "transparent") => {
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
                    backgroundColor: null, // Sempre captura com transparência
                    scale: resolutionScale,
                    useCORS: true,
                    logging: false,
                    onclone: clonedDoc => {
                        // Garante que o elemento está visível no clone
                        const clonePreview =
                            clonedDoc.getElementById("sprite-preview");
                        if (clonePreview) {
                            clonePreview.style.opacity = "1";
                            clonePreview.style.visibility = "visible";
                        }
                    }
                });

                const ctx = capturedCanvas.getContext("2d");
                if (!ctx) continue;

                // Captura incluindo alpha channel
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
    }, [resolutionScale, backgroundColor]);

    const exportSpritesheet = useCallback(async () => {
        await captureFramesForExport();

        if (!framesRef.current.length || !canvasRef.current) {
            alert("Nenhum frame capturado!");
            return;
        }

        const canvas = canvasRef.current;
        const [firstFrame] = framesRef.current;

        // Configura dimensões do canvas
        canvas.width = firstFrame.width * framesRef.current.length;
        canvas.height = firstFrame.height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // Preenche o fundo se necessário
        if (backgroundColor !== "transparent") {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Desenha cada frame
        framesRef.current.forEach((frame, index) => {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = frame.width;
            tempCanvas.height = frame.height;
            const tempCtx = tempCanvas.getContext("2d");

            if (tempCtx) {
                tempCtx.putImageData(frame, 0, 0);
                ctx.drawImage(
                    tempCanvas,
                    index * frame.width,
                    0,
                    frame.width,
                    frame.height
                );
            }
        });

        // Gera URL da imagem
        const dataUrl = canvas.toDataURL("image/png");
        const fileName = `spritesheet-${Date.now()}.png`;

        // Plataforma Web
        if (Capacitor.getPlatform() === "web") {
            const link = document.createElement("a");
            link.download = fileName;
            link.href = dataUrl;

            // Método universal para disparar o download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return;
        }

        // Plataforma Mobile
        try {
            const base64Data = dataUrl.split(",")[1];

            await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Documents,
            //    encoding: "base64"
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
    }, [captureFramesForExport, backgroundColor, resolutionScale]);

    return {
        canvasRef,
        exportSpritesheet,
        isExporting,
        exportProgress,
        resolutionScale,
        setResolutionScale
    };
};
