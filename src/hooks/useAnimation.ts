import { useState, useEffect, useCallback } from "react";
import { animationDefinitions } from "../classes/animations";
import { useSpriteFile } from "./useSpriteFile";

const validClasses = Object.values(animationDefinitions)
    .map(a => a.animateClass)
    .filter(c => c !== "");

export const useAnimation = (spriteRef: React.RefObject<HTMLImageElement>) => {
    const [currentAnimation, setCurrentAnimation] = useState<string>("none");
    const [speed, setSpeed] = useState<number>(1);

    const { spriteSrc } = useSpriteFile();
    useEffect(() => {
        if (spriteRef.current) {
            const element = spriteRef.current;
            const definition = animationDefinitions[currentAnimation];

            element.classList.remove(...validClasses);
            element.classList.add(definition.animateClass);
            element.classList.add("animate__animated");

            /* Força reflow apenas se for uma animação válida
            if (currentAnimation !== "none") {
                void element.offsetWidth;
            }
*/
            // Atualiza duração apenas para animações ativas
            if (currentAnimation !== "none") {
                element.style.animationDuration = `${
                    speed ?? definition.baseDuration
                }s`;
            } else {
                element.style.animationDuration = "";
            }
        }
    });

    return {
        currentAnimation,
        speed,
        setCurrentAnimation,
        setSpeed,
        animationDefs: animationDefinitions
    };
};
