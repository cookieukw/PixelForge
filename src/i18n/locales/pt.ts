import type { Translation } from "./en";

// Portuguese (Brazil) — matches every key in the English locale.
export const pt: Translation = {
  header: {
    title: "PixelForge",
  },
  tabs: {
    settings: "Ajustes",
    colors: "Cores",
  },
  actions: {
    selectSprite: "Selecionar Sprite",
    exportPng: "Exportar PNG",
    exportGif: "Exportar GIF",
    exporting: "Exportando... ({progress}%)",
    generatingGif: "Gerando GIF... ({progress}%)",
  },
  preview: {
    noSprite: "Nenhum sprite carregado",
  },
  controls: {
    title: "Controles",
    speed: "Velocidade: {value}s",
  },
  resolution: {
    title: "Resolução da Exportação",
    hint: "Carregue um sprite para ver as dimensões de saída.",
    info: "Frame: {frameW}×{frameH}px · Sheet: {totalW}×{totalH}px",
    low: "Baixa (0.5×)",
    original: "Original (1×)",
    high: "Alta (2×)",
    max: "Máxima (4×)",
    placeholder: "Selecione a resolução",
  },
  smoothness: {
    title: "Suavidade da Animação",
    info: "{count} frames",
    low: "Básica (10 frames)",
    medium: "Suave (20 frames)",
    high: "Muito Suave (30 frames)",
    ultra: "Cinematográfica (60 frames)",
  },
  background: {
    title: "Cor de Fundo",
  },
  alerts: {
    noFrames: "Nenhum frame capturado! Carregue um sprite primeiro.",
    gifError: "Erro ao gerar o GIF. Consulte o console para detalhes.",
    savedAt: "Salvo em: {path}",
    saveError: "Erro ao salvar o arquivo! Verifique as permissões.",
  },
  animations: {
    none: "Nenhuma animação está aplicada.",
    bounce: "O elemento se move para cima e para baixo em um padrão de quique.",
    flash:
      "O elemento pisca repetidamente, alternando entre visível e invisível.",
    pulse: "O elemento cresce e diminui suavemente, simulando uma pulsação.",
    rubberBand: "O elemento se estica e contrai como um elástico.",
    shakeX: "O elemento balança rapidamente para os lados.",
    shakeY: "O elemento balança rapidamente para cima e para baixo.",
    headShake: "O elemento faz um movimento de negação com a cabeça.",
    swing: "O elemento oscila como um pêndulo em torno do ponto de ancoragem.",
    tada: "O elemento gira ligeiramente e cresce rapidamente, dando um efeito de celebração.",
    wobble:
      "O elemento se move para frente e para trás com uma oscilação exagerada.",
    jello: "O elemento balança e vibra como uma gelatina.",
    heartBeat: "O elemento expande e contrai como um batimento cardíaco.",
    fadeIn: "O elemento aparece suavemente ao aumentar sua opacidade.",
    fadeOut: "O elemento desaparece suavemente ao diminuir sua opacidade.",
    flip: "O elemento gira como se estivesse sendo virado em 3D.",
    flipInX: "O elemento gira horizontalmente enquanto aparece.",
    flipInY: "O elemento gira verticalmente enquanto aparece.",
    flipOutX: "O elemento gira horizontalmente enquanto desaparece.",
    flipOutY: "O elemento gira verticalmente enquanto desaparece.",
    rotateIn: "O elemento gira enquanto entra na tela.",
    rotateOut: "O elemento gira enquanto sai da tela.",
    zoomIn: "O elemento cresce suavemente ao aparecer.",
    zoomOut: "O elemento encolhe suavemente ao desaparecer.",
    lightSpeedInRight:
      "O elemento entra rapidamente da direita, como um flash.",
    lightSpeedInLeft:
      "O elemento entra rapidamente da esquerda, como um flash.",
    lightSpeedOutRight:
      "O elemento sai rapidamente para a direita, como um flash.",
    lightSpeedOutLeft:
      "O elemento sai rapidamente para a esquerda, como um flash.",
    slideInDown: "O elemento desliza de cima para baixo ao aparecer.",
    slideInLeft: "O elemento desliza da esquerda para a direita ao aparecer.",
    slideInRight: "O elemento desliza da direita para a esquerda ao aparecer.",
    slideInUp: "O elemento desliza de baixo para cima ao aparecer.",
    slideOutDown: "O elemento desliza de cima para baixo ao desaparecer.",
    slideOutLeft:
      "O elemento desliza da esquerda para a direita ao desaparecer.",
    slideOutRight:
      "O elemento desliza da direita para a esquerda ao desaparecer.",
    slideOutUp: "O elemento desliza de baixo para cima ao desaparecer.",
  },
};
