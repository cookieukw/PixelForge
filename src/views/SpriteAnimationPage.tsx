import { useRef, useCallback, useEffect } from "react";

import {
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonPage,
    IonHeader,
    IonList,
    IonToolbar,
    IonTitle,
    IonLabel,
    IonContent,
    IonButton,useIonViewWillEnter
} from "@ionic/react";
import { initializeAdmob, showInterstitial } from "../classes/admob";

import { useAnimation } from "../hooks/useAnimation";
import { useSpriteFile } from "../hooks/useSpriteFile";
import { useSpriteCapture } from "../hooks/useSpriteCapture";
import { AnimationSelector } from "../components/AnimationSelector";
import { SpritePreview } from "../components/SpritePreview";
import { AnimationControls } from "../components/AnimationControls";

const SpriteAnimationPage: React.FC = () => {
    const spriteRef = useRef<HTMLImageElement>(null);
    const {
        currentAnimation,
        speed,
        intensity,
        setCurrentAnimation,
        setSpeed,
        setIntensity,
        animationDefs
    } = useAnimation(spriteRef);
    const {
        canvasRef,
        exportSpritesheet,
        isExporting,
        exportProgress,
        resolutionScale,
        setResolutionScale,
        
        
    } = useSpriteCapture();

    const { spriteSrc, handleFileChange } = useSpriteFile();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    useEffect(() => {
        const styleTag = document.getElementById("dynamic-keyframes");
        if (styleTag) {
            styleTag.innerHTML =
                animationDefs[currentAnimation].keyframes(intensity);
        }
    }, []);
    useIonViewWillEnter(() => {
        initializeAdmob();
        showInterstitial();
    });
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar
                    style={{
                        "--background": "#2d2b30 ",
                        "--color": "white",
                        borderTop: "1px solid white",
                        textAlign: "center"
                    }}
                >
                    <IonTitle>PixelForge </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <style id="dynamic-keyframes"></style>

                <AnimationSelector
                    currentAnimation={currentAnimation}
                    animationDefs={animationDefs}
                    onSelect={setCurrentAnimation}
                />

                <div style={{ padding: "10px", textAlign: "left" }}>
                    <p>{animationDefs[currentAnimation].description}</p>
                </div>

                <SpritePreview spriteSrc={spriteSrc} ref={spriteRef} />

                <AnimationControls
                    speed={speed}
                    intensity={intensity}
                    onSpeedChange={setSpeed}
                    onIntensityChange={setIntensity}
                />

                <IonList className="ion-margin-vertical">
                    <IonItem>
                        <IonLabel>Escala de Resolução</IonLabel>
                        <IonSelect
                            value={resolutionScale}
                            onIonChange={e =>
                                setResolutionScale(e.detail.value)
                            }
                        >
                            <IonSelectOption value="nearest">
                                Nearest
                            </IonSelectOption>
                            <IonSelectOption value="hqx">
                                HQX (4x Pixel Art)
                            </IonSelectOption>
                            <IonSelectOption value="xbrz">
                                xBRZ (4x Suave)
                            </IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Resolução</IonLabel>
                        <IonSelect
                            value={resolutionScale}
                            onIonChange={e =>
                                setResolutionScale(e.detail.value)
                            }
                        >
                            <IonSelectOption value={0.5}>
                                Baixa (0.5x)
                            </IonSelectOption>
                            <IonSelectOption value={1}>
                                Original (1x)
                            </IonSelectOption>
                            <IonSelectOption value={2}>
                                Alta (2x)
                            </IonSelectOption>
                            <IonSelectOption value={4}>
                                Máxima (4x)
                            </IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    {isExporting && (
                        <IonProgressBar
                            value={exportProgress / 100}
                            color="primary"
                        />
                    )}

                </IonList>


                <IonButton
                    expand="block"
                    onClick={exportSpritesheet}
                    disabled={isExporting || !spriteSrc}
                >
                    {isExporting ? "Exportando..." : "Exportar Sprite Sheet"}
                </IonButton>
                <IonButton
                    className="ion-padding"
                    shape="round"
                    expand="block"
                    onClick={openFilePicker}
                >
                    Selecionar Sprite
                </IonButton>

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
