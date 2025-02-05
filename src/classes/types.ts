export interface AnimationDefinition {
    animateClass: string;
    baseDuration: number;
    description: string;
    keyframes: (intensity: number) => string;
}
