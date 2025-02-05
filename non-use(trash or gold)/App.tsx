import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo
} from "react";
import html2canvas from "html2canvas";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonItem,
    IonRange
} from "@ionic/react";

interface AnimationDefinition {
    animateClass: string; // Classe customizada a ser aplicada ao sprite
    baseDuration: number; // Duração base da animação (em segundos)
    description: string; // Descrição da animação
    keyframes: (intensity: number) => string; // Função que retorna os keyframes conforme a intensidade
}

// DEFINIÇÕES MEMORIZADAS – não serão recriadas a cada render
const animationDefinitions: Record<string, AnimationDefinition> = {
    none: {
        animateClass: "",
        baseDuration: 1,
        description: "Nenhuma animação está aplicada.",
        keyframes: () => ""
    },
    bounce: {
        animateClass: "customBounce",
        baseDuration: 0.5,
        description:
            "O sprite se move para cima e para baixo. A intensidade define a distância do salto.",
        keyframes: (intensity: number) => {
            const distance = (intensity * 0.3).toFixed(2);
            return `
        @keyframes customBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-${distance}px); }
        }
      `;
        }
    },
    shake: {
        animateClass: "customShake",
        baseDuration: 0.5,
        description:
            "O sprite balança para os lados. A intensidade define o deslocamento lateral.",
        keyframes: (intensity: number) => {
            const distance = (intensity * 0.1).toFixed(2);
            return `
        @keyframes customShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-${distance}px); }
          50% { transform: translateX(${distance}px); }
          75% { transform: translateX(-${distance}px); }
        }
      `;
        }
    },
    flip: {
        animateClass: "customFlip",
        baseDuration: 1,
        description:
            "O sprite realiza uma rotação no eixo Y. A intensidade define o ângulo da rotação.",
        keyframes: (intensity: number) => {
            const angle = (intensity * 3.6).toFixed(2);
            return `
        @keyframes customFlip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(${angle}deg); }
          100% { transform: rotateY(0deg); }
        }
      `;
        }
    }
};

const TOTAL_FRAMES = 10; // Número de frames a capturar para a exportação
const CAPTURE_INTERVAL = 150; // Intervalo (ms) entre capturas (ajuste conforme necessário)

const SpriteAnimationPage: React.FC = () => {
    // Estados de controle da animação, velocidade, intensidade e da imagem do sprite
    const [currentAnimation, setCurrentAnimation] = useState<string>("none");
    const [speed, setSpeed] = useState<number>(1);
    const [intensity, setIntensity] = useState<number>(50);
    const [spriteSrc, setSpriteSrc] = useState<string>("");

    // Usaremos uma ref para armazenar os frames capturados (evitando re-renderizações constantes)
    const framesRef = useRef<ImageData[]>([]);

    // Refs para acessar os elementos DOM
    const spriteRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Memoriza as definições de animação
    const animationDefs = useMemo(() => animationDefinitions, []);

    // Insere estilos fixos para as classes de animação customizadas (que usam os keyframes dinâmicos)
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
      .customBounce {
        animation-name: customBounce;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
      .customShake {
        animation-name: customShake;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
      .customFlip {
        animation-name: customFlip;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Atualiza os keyframes dinâmicos conforme a animação atual e a intensidade
    const updateDynamicKeyframes = useCallback(() => {
        const styleTag = document.getElementById("dynamic-keyframes");
        if (styleTag) {
            if (currentAnimation === "none") {
                styleTag.innerHTML = "";
            } else {
                const definition = animationDefs[currentAnimation];
                styleTag.innerHTML = definition.keyframes(intensity);
            }
        }
    }, [currentAnimation, intensity, animationDefs]);

    useEffect(() => {
        updateDynamicKeyframes();
    }, [updateDynamicKeyframes]);

    // Atualiza a duração da animação com base na velocidade
    useEffect(() => {
        if (spriteRef.current && currentAnimation !== "none") {
            const definition = animationDefs[currentAnimation];
            spriteRef.current.style.animationDuration =
                definition.baseDuration / speed + "s";
        }
    }, [speed, currentAnimation, animationDefs]);

    // Ao selecionar uma animação, apenas atualiza o preview sem iniciar captura contínua
    const startAnimation = useCallback(
        (animation: string) => {
            setCurrentAnimation(animation);
            if (spriteRef.current) {
                spriteRef.current.className = "";
                void spriteRef.current.offsetWidth;
                if (animation !== "none") {
                    spriteRef.current.classList.add(
                        animationDefs[animation].animateClass
                    );
                }
            }
        },
        [animationDefs]
    );

    // Função que, somente quando o usuário clicar em Exportar,
    // captura os frames da animação utilizando html2canvas
    const captureFramesForExport = useCallback(async () => {
        framesRef.current = []; // Reinicia os frames
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            // Aguarda um pequeno intervalo entre capturas
            await new Promise(resolve => setTimeout(resolve, CAPTURE_INTERVAL));
            const preview = document.getElementById("sprite-preview");
            if (!preview) continue;
            try {
                const capturedCanvas = await html2canvas(preview, {
                    backgroundColor: null
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
            } catch (error) {
                console.error("Erro ao capturar frame:", error);
            }
        }
    }, []);

    // Quando o usuário clicar em "Exportar Sprite Sheet", dispara a captura e em seguida o download
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
        link.download = "spritesheet.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }, [captureFramesForExport]);

    // Gerencia a seleção do arquivo de imagem
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

    // Abre o file input oculto
    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Controle de Animações de Sprite</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Tag para injeção dos keyframes dinâmicos */}
                <style id="dynamic-keyframes"></style>

                {/* Segmento para escolha da animação */}
                <IonSegment
                    value={currentAnimation}
                    onIonChange={e => startAnimation(e.detail.value)}
                >
                    {Object.keys(animationDefs).map(key => (
                        <IonSegmentButton key={key} value={key}>
                            <IonLabel>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </IonLabel>
                        </IonSegmentButton>
                    ))}
                </IonSegment>

                {/* Descrição da animação selecionada */}
                <div style={{ padding: "10px", textAlign: "left" }}>
                    <p>{animationDefs[currentAnimation].description}</p>
                </div>

                {/* Preview do sprite */}
                <h3 style={{ textAlign: "center" }}>Preview</h3>
                <div
                    id="sprite-preview"
                    style={{
                        width: "150px",
                        height: "150px",
                        backgroundColor: "#ddd",
                        margin: "10px auto",
                        border: "2px solid #333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden"
                    }}
                >
                    {spriteSrc ? (
                        <img
                            ref={spriteRef}
                            src={spriteSrc}
                            alt="Sprite"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                    ) : (
                        <p>Sem Sprite</p>
                    )}
                </div>

                {/* Sliders de velocidade e intensidade */}
                <IonItem>
                    <IonLabel>Velocidade</IonLabel>
                    <IonRange
                        min={0.5}
                        max={3}
                        step={0.1}
                        value={speed}
                        onIonChange={e => setSpeed(e.detail.value as number)}
                    />
                    <IonLabel>{speed}</IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel>Intensidade</IonLabel>
                    <IonRange
                        min={0}
                        max={100}
                        step={1}
                        value={intensity}
                        onIonChange={e =>
                            setIntensity(e.detail.value as number)
                        }
                    />
                    <IonLabel>{intensity}</IonLabel>
                </IonItem>

                {/* Botões para selecionar sprite e exportar spritesheet */}
                <IonButton expand="block" onClick={openFilePicker}>
                    Selecionar Sprite
                </IonButton>
                <IonButton expand="block" onClick={exportSpritesheet}>
                    Exportar Sprite Sheet
                </IonButton>

                {/* Input file oculto */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />


                <canvas ref={canvasRef} style={{ display: "none" }} />
            </IonContent>
        </IonPage>
    );
};

export default SpriteAnimationPage;
