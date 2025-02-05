export interface AnimationDefinition {
    animateClass: string;
    baseDuration: number;
    description: string;
    keyframes: (intensity: number) => string;
}

export const animationDefinitions: Record<string, AnimationDefinition> = {
    none: {
        animateClass: "",
        baseDuration: 1,
        description: "Nenhuma animação está aplicada.",
        keyframes: () => ""
    },
    bounce: {
        animateClass: "animate__bounce",
        baseDuration: 1,
        description:
            "O elemento se move para cima e para baixo em um padrão de quique.",
        keyframes: () => ""
    },
    flash: {
        animateClass: "animate__flash",
        baseDuration: 1,
        description:
            "O elemento pisca repetidamente, alternando entre visível e invisível.",
        keyframes: () => ""
    },
    pulse: {
        animateClass: "animate__pulse",
        baseDuration: 1,
        description:
            "O elemento cresce e diminui suavemente, simulando uma pulsação.",
        keyframes: () => ""
    },
    rubberBand: {
        animateClass: "animate__rubberBand",
        baseDuration: 1,
        description: "O elemento se estica e contrai como um elástico.",
        keyframes: () => ""
    },
    shakeX: {
        animateClass: "animate__shakeX",
        baseDuration: 1,
        description: "O elemento balança rapidamente para os lados.",
        keyframes: () => ""
    },
    shakeY: {
        animateClass: "animate__shakeY",
        baseDuration: 1,
        description: "O elemento balança rapidamente para cima e para baixo.",
        keyframes: () => ""
    },
    headShake: {
        animateClass: "animate__headShake",
        baseDuration: 1,
        description: "O elemento faz um movimento de negação com a cabeça.",
        keyframes: () => ""
    },
    swing: {
        animateClass: "animate__swing",
        baseDuration: 1,
        description:
            "O elemento oscila como um pêndulo em torno do ponto de ancoragem.",
        keyframes: () => ""
    },
    tada: {
        animateClass: "animate__tada",
        baseDuration: 1,
        description:
            "O elemento gira ligeiramente e cresce rapidamente, dando um efeito de celebração.",
        keyframes: () => ""
    },
    wobble: {
        animateClass: "animate__wobble",
        baseDuration: 1,
        description:
            "O elemento se move para frente e para trás com uma oscilação exagerada.",
        keyframes: () => ""
    },
    jello: {
        animateClass: "animate__jello",
        baseDuration: 1,
        description: "O elemento balança e vibra como uma gelatina.",
        keyframes: () => ""
    },
    heartBeat: {
        animateClass: "animate__heartBeat",
        baseDuration: 1,
        description: "O elemento expande e contrai como um batimento cardíaco.",
        keyframes: () => ""
    },
    fadeIn: {
        animateClass: "animate__fadeIn",
        baseDuration: 1,
        description: "O elemento aparece suavemente ao aumentar sua opacidade.",
        keyframes: () => ""
    },
    fadeOut: {
        animateClass: "animate__fadeOut",
        baseDuration: 1,
        description:
            "O elemento desaparece suavemente ao diminuir sua opacidade.",
        keyframes: () => ""
    },
    flip: {
        animateClass: "animate__flip",
        baseDuration: 1,
        description: "O elemento gira como se estivesse sendo virado em 3D.",
        keyframes: () => ""
    },
    flipInX: {
        animateClass: "animate__flipInX",
        baseDuration: 1,
        description: "O elemento gira horizontalmente enquanto aparece.",
        keyframes: () => ""
    },
    flipInY: {
        animateClass: "animate__flipInY",
        baseDuration: 1,
        description: "O elemento gira verticalmente enquanto aparece.",
        keyframes: () => ""
    },
    flipOutX: {
        animateClass: "animate__flipOutX",
        baseDuration: 1,
        description: "O elemento gira horizontalmente enquanto desaparece.",
        keyframes: () => ""
    },
    flipOutY: {
        animateClass: "animate__flipOutY",
        baseDuration: 1,
        description: "O elemento gira verticalmente enquanto desaparece.",
        keyframes: () => ""
    },
    rotateIn: {
        animateClass: "animate__rotateIn",
        baseDuration: 1,
        description: "O elemento gira enquanto entra na tela.",
        keyframes: () => ""
    },
    rotateOut: {
        animateClass: "animate__rotateOut",
        baseDuration: 1,
        description: "O elemento gira enquanto sai da tela.",
        keyframes: () => ""
    },
    zoomIn: {
        animateClass: "animate__zoomIn",
        baseDuration: 1,
        description: "O elemento cresce suavemente ao aparecer.",
        keyframes: () => ""
    },
    zoomOut: {
        animateClass: "animate__zoomOut",
        baseDuration: 1,
        description: "O elemento encolhe suavemente ao desaparecer.",
        keyframes: () => ""
    },
    lightSpeedInRight: {
        animateClass: "animate__lightSpeedInRight",
        baseDuration: 1,
        description: "O elemento entra rapidamente da direita, como um flash.",
        keyframes: () => ""
    },
    lightSpeedInLeft: {
        animateClass: "animate__lightSpeedInLeft",
        baseDuration: 1,
        description: "O elemento entra rapidamente da esquerda, como um flash.",
        keyframes: () => ""
    },
    lightSpeedOutRight: {
        animateClass: "animate__lightSpeedOutRight",
        baseDuration: 1,
        description:
            "O elemento sai rapidamente para a direita, como um flash.",
        keyframes: () => ""
    },
    lightSpeedOutLeft: {
        animateClass: "animate__lightSpeedOutLeft",
        baseDuration: 1,
        description:
            "O elemento sai rapidamente para a esquerda, como um flash.",
        keyframes: () => ""
    },
    slideInDown: {
        animateClass: "animate__slideInDown",
        baseDuration: 1,
        description: "O elemento desliza de cima para baixo ao aparecer.",
        keyframes: () => ""
    },
    slideInLeft: {
        animateClass: "animate__slideInLeft",
        baseDuration: 1,
        description:
            "O elemento desliza da esquerda para a direita ao aparecer.",
        keyframes: () => ""
    },
    slideInRight: {
        animateClass: "animate__slideInRight",
        baseDuration: 1,
        description:
            "O elemento desliza da direita para a esquerda ao aparecer.",
        keyframes: () => ""
    },
    slideInUp: {
        animateClass: "animate__slideInUp",
        baseDuration: 1,
        description: "O elemento desliza de baixo para cima ao aparecer.",
        keyframes: () => ""
    },
    slideOutDown: {
        animateClass: "animate__slideOutDown",
        baseDuration: 1,
        description: "O elemento desliza de cima para baixo ao desaparecer.",
        keyframes: () => ""
    },
    slideOutLeft: {
        animateClass: "animate__slideOutLeft",
        baseDuration: 1,
        description:
            "O elemento desliza da esquerda para a direita ao desaparecer.",
        keyframes: () => ""
    },
    slideOutRight: {
        animateClass: "animate__slideOutRight",
        baseDuration: 1,
        description:
            "O elemento desliza da direita para a esquerda ao desaparecer.",
        keyframes: () => ""
    },
    slideOutUp: {
        animateClass: "animate__slideOutUp",
        baseDuration: 1,
        description: "O elemento desliza de baixo para cima ao desaparecer.",
        keyframes: () => ""
    }
};
