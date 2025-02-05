import { useRef, useCallback, useState } from "react";
import html2canvas from "html2canvas";

const TOTAL_FRAMES = 10;
const CAPTURE_INTERVAL = 150;

export const useSpriteCapture = (
  
) => {
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
          backgroundColor: null,
          scale: resolutionScale // A escala básica aqui
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
        setExportProgress((i + 1) / TOTAL_FRAMES * 100);
        await new Promise(resolve => setTimeout(resolve, CAPTURE_INTERVAL));
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

    const frameWidth = framesRef.current[0].width;
    const frameHeight = framesRef.current[0].height;
    const canvas = canvasRef.current;
    
    canvas.width = frameWidth * framesRef.current.length;
    canvas.height = frameHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    framesRef.current.forEach((frame, index) => {
      ctx.putImageData(frame, index * frameWidth, 0);
    });

    const link = document.createElement("a");
    link.download = `spritesheet-${resolutionScale}x.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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