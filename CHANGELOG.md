# Changelog

## [Unreleased]

### 🐛 Correção de Bugs (Portuguese)

- **Performance ao trocar cor de fundo** — A troca de cor do fundo do sprite agora usa atualização direta no DOM durante o arrasto, evitando re-renders do React e eliminando o lag perceptível na UI.
- **Bugs visuais no seletor de animações** — O seletor horizontal de animações exibia os nomes colados uns nos outros e cortava itens sem indicar que havia mais conteúdo. Agora tem espaçamento adequado, setas de navegação (`‹` `›`) e gradiente nas bordas para indicar overflow.
- **Sprite salvo entre sessões** — A imagem selecionada agora é persistida no `localStorage` como DataURL. Ao recarregar a página, o sprite anterior é restaurado automaticamente.
- **Animação ao importar imagem** — Ao importar um sprite com uma animação já selecionada, a animação era aplicada apenas após alternar para outra e voltar. Agora é aplicada imediatamente no momento em que a imagem termina de carregar.

---

### ✨ Novidades (Portuguese)

- **Melhoria no sistema de exportação** — A exportação foi reescrita do zero usando a Canvas API nativa, eliminando a dependência do `html2canvas`. Resultado mais rápido, mais fiel e sem artefatos visuais.
- **Suporte a múltiplos tamanhos de imagem** — O preview do sprite agora se adapta ao aspect ratio real da imagem (via CSS `aspect-ratio`), exibindo `imageRendering: pixelated` para pixel art nítido. As dimensões reais (`ex: 64 × 64 px`) são exibidas abaixo do preview.
- **Exportação baseada na resolução original** — A spritesheet exportada usa `naturalWidth × naturalHeight` da imagem como base, não mais um tamanho fixo de container. A escala de exportação (0.5×, 1×, 2×, 4×) é aplicada sobre as dimensões reais. As dimensões de saída são exibidas em tempo real na UI.
- **Tradução para Inglês** — Sistema de i18n com detecção automática do idioma do sistema (`navigator.language`). Suporta Português e Inglês, com fallback para Inglês para idiomas sem tradução disponível.
- **Melhor feedback visual das animações** — As descrições das animações são traduzidas junto com o restante da interface. O seletor de animações ganhou botões de scroll com fade nas bordas para uma navegação mais clara.
- **Exportação em GIF animado** — Nova opção de exportar o sprite como `.gif` animado. Usa `requestAnimationFrame` para capturar até 60 frames em sincronia com o ciclo de renderização do browser, incluindo todas as transformações CSS das animações (bounce, pulse, shake, etc.). O delay por frame é medido em tempo real para corresponder à taxa de atualização da tela (~50fps efetivo, limite do formato GIF).

---

### 🐛 Bug Fixes (English)

- **Background color change performance** — Background color changes now update the DOM directly during dragging, avoiding React re-renders and eliminating UI lag.
- **Animation selector visual bugs** — The horizontal animation selector previously had overlapping names and cut off items without indication. It now features proper spacing, navigation arrows (`‹` `›`), and edge gradients to indicate overflow.
- **Sprite persistence between sessions** — The selected image is now saved to `localStorage` as a DataURL. Upon reloading the page, the previous sprite is automatically restored.
- **Animation on image import** — When importing a sprite with an animation already selected, it previously only animated after toggling. It now applies immediately as soon as the image finishes loading.

### ✨ New Features (English)

- **Export system improvement** — The export functionality was rewritten from scratch using native Canvas API, removing the `html2canvas` dependency. This results in faster, more accurate exports without visual artifacts.
- **Support for multiple image sizes** — The sprite preview now adapts to the image's actual aspect ratio (via CSS `aspect-ratio`), displaying `imageRendering: pixelated` for sharp pixel art. Real dimensions (e.g., `64 × 64 px`) are displayed below the preview.
- **Native resolution export** — Exported spritesheets now use the image's `naturalWidth × naturalHeight` as a base, instead of a fixed container size. Export scale (0.5×, 1×, 2×, 4×) is applied to the real dimensions. Output dimensions are shown in real-time in the UI.
- **English Translation** — i18n system with automatic language detection (`navigator.language`). Supports Portuguese and English, with English as the fallback for unsupported languages.
- **Improved animation visual feedback** — Animation descriptions are now translated alongside the rest of the interface. The animation selector features scroll buttons with edge fades for clearer navigation.
- **Animated GIF export** — New option to export the sprite as an animated `.gif`. Uses `requestAnimationFrame` to capture up to 60 frames in sync with the browser's render cycle, including all CSS transformations (bounce, pulse, shake, etc.). Frame delay is measured in real-time to match the screen refresh rate (~50fps effective, GIF format limit).
