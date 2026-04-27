import { useState, useEffect, useCallback } from "react";
import { animationDefinitions } from "../classes/animations";

const validClasses = Object.values(animationDefinitions)
    .map(a => a.animateClass)
    .filter(c => c !== "");

export const useAnimation = (spriteRef: React.RefObject<HTMLImageElement>) => {
    const [currentAnimation, setCurrentAnimation] = useState<string>("none");
    const [speed, setSpeed] = useState<number>(1);

    // Extracted so it can be called both by the effect AND externally (e.g. when
    // a new image is loaded and the <img> element is freshly mounted).
    const applyAnimation = useCallback(() => {
        const element = spriteRef.current;
        if (!element) return;

        const definition = animationDefinitions[currentAnimation];

        element.classList.remove(...validClasses);
        element.classList.add(definition.animateClass);
        element.classList.add("animate__animated", "animate__infinite");

        if (currentAnimation !== "none") {
            element.style.animationDuration = `${speed ?? definition.baseDuration}s`;
        } else {
            element.style.animationDuration = "";
        }
    }, [spriteRef, currentAnimation, speed]);

    // Re-apply whenever the selected animation or speed changes
    useEffect(() => {
        applyAnimation();
    }, [applyAnimation]);

    return {
        currentAnimation,
        speed,
        setCurrentAnimation,
        setSpeed,
        animationDefs: animationDefinitions,
        // Call this after a new <img> mounts so the CSS classes are applied
        // immediately without requiring the user to re-select the animation.
        reapplyAnimation: applyAnimation,
    };
};
