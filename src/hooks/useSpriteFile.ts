import { useState, useCallback } from "react";

const STORAGE_KEY = "pixelforge:spriteSrc";

function loadFromStorage(): string {
    try {
        return localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
        return "";
    }
}

function saveToStorage(dataUrl: string) {
    try {
        if (dataUrl) {
            localStorage.setItem(STORAGE_KEY, dataUrl);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (e) {
        // Storage quota exceeded (large sprites at high resolution)
        console.warn("[useSpriteFile] localStorage quota exceeded — sprite not persisted.", e);
    }
}

export const useSpriteFile = () => {
    const [spriteSrc, setSpriteSrc] = useState<string>(loadFromStorage);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = ev => {
                    const dataUrl = ev.target?.result as string;
                    setSpriteSrc(dataUrl);
                    saveToStorage(dataUrl);
                };
                reader.readAsDataURL(file);
            }
        },
        []
    );

    const clearSprite = useCallback(() => {
        setSpriteSrc("");
        saveToStorage("");
    }, []);

    return { spriteSrc, handleFileChange, clearSprite };
};
