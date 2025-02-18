import { useState, useCallback } from "react";

export const useSpriteFile = () => {
    const [spriteSrc, setSpriteSrc] = useState<string>("");

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = ev => {
                    setSpriteSrc(ev.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        []
    );

    return { spriteSrc, handleFileChange };
};
