import { useState, useEffect } from "react";
import { animationDefinitions } from "../classes/animations";

export const useAnimation = (spriteRef: React.RefObject<HTMLImageElement>) => {
    const [currentAnimation, setCurrentAnimation] = useState<string>("none");
    const [speed, setSpeed] = useState<number>(1);
    const [intensity, setIntensity] = useState<number>(50);

    useEffect(() => {
        if (spriteRef.current) {
            const element = spriteRef.current;
            const definition = animationDefinitions[currentAnimation];

            // Remove apenas classes válidas
            const validClasses = Object.values(animationDefinitions)
                .map(a => a.animateClass)
                .filter(c => c !== "");
            element.classList.remove(...validClasses);

            // Força reflow apenas se for uma animação válida
            if (currentAnimation !== "none") {
                void element.offsetWidth;
                element.classList.add(definition.animateClass);
                element.classList.add("animate__animated");
            }

            // Atualiza duração apenas para animações ativas
            if (currentAnimation !== "none") {
                element.style.animationDuration = `${
                    speed ?? definition.baseDuration
                }s`;
            } else {
                element.style.animationDuration = "";
            }
        }
    }, [currentAnimation, speed, intensity, spriteRef]);

    return {
        currentAnimation,
        speed,
        intensity,
        setCurrentAnimation,
        setSpeed,
        setIntensity,
        animationDefs: animationDefinitions
    };
};
