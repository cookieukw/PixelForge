import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

const TOTAL_FRAMES = 10;
const CAPTURE_INTERVAL = 150;

export const useSprite = () => {
    const [spriteSrc, setSpriteSrc] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const framesRef = useRef<ImageData[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const captureFramesForExport = useCallback(async () => {
        framesRef.current = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            await new Promise(resolve => setTimeout(resolve, CAPTURE_INTERVAL));
            const preview = document.getElementById("sprite-preview");
            if (!preview) continue;
            try {
                const capturedCanvas = await html2canvas(preview, { backgroundColor: null });
                const ctx = capturedCanvas.getContext("2d");
                if (!ctx) continue;
                framesRef.current.push(ctx.getImageData(0, 0, capturedCanvas.width, capturedCanvas.height));
            } catch (error) {
                console.error("Erro ao capturar frame:", error);
            }
        }
    }, []);

    return { spriteSrc, setSpriteSrc, fileInputRef, openFilePicker, captureFramesForExport, canvasRef };
};