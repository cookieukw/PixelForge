import { useRef, useCallback, useState, useEffect } from "react";

import {
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonPage,
    IonList,
    IonLabel,
    IonContent,
    IonButton,
    useIonViewWillEnter
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { initializeAdmob, showInterstitial } from "../classes/admob";
import ColorPicker from "../components/ColorPicker";
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
        setCurrentAnimation,
        setSpeed,
        animationDefs
    } = useAnimation(spriteRef);
    const {
        canvasRef,
        exportSpritesheet,
        isExporting,
        exportProgress,
        resolutionScale,
        setResolutionScale
    } = useSpriteCapture();

    const { spriteSrc, handleFileChange } = useSpriteFile();
    const [backgroundColor, setBackgroundColor] =
        useState<string>("transparent");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    useIonViewWillEnter(() => {
        initializeAdmob();
        showInterstitial();
    });
    return (
        <IonPage>
            <IonContent className="ion-padding">
                <style id="dynamic-keyframes"></style>

                <AnimationSelector
                    currentAnimation={currentAnimation}
                    animationDefs={animationDefs}
                    onSelect={setCurrentAnimation}
                />

                <div
                    style={{
                        textAlign: "center"
                    }}
                >
                    <p
                        style={{
                            lineHeight: "2.5ex",
                            fontSize: "16px",
                            height: "7.5ex",
                            overflow: "hidden"
                        }}
                    >
                        {animationDefs[currentAnimation].description}
                    </p>
                </div>

                <SpritePreview
                    key={spriteSrc}
                    spriteSrc={spriteSrc}
                    ref={spriteRef}
                    backgroundColor={backgroundColor}
                />
                <IonList className="ion-margin-vertical">
                    <Swiper
                        className="swiper-no-swiping"
                        pagination={{
                            dynamicBullets: true
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                    >
                        <SwiperSlide>
                            <AnimationControls
                                speed={speed}
                                onSpeedChange={setSpeed}
                            />

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
                        </SwiperSlide>
                        <SwiperSlide>
                            <IonItem>
                                <ColorPicker
                                    color={backgroundColor}
                                    onChangeComplete={color =>
                                        setBackgroundColor(color.hex)
                                    }
                                />
                            </IonItem>
                        </SwiperSlide>
                    </Swiper>
                </IonList>
                {isExporting && (
                    <IonProgressBar
                        value={exportProgress / 100}
                        color="primary"
                    />
                )}
                <IonButton
                    expand="block"
                    onClick={exportSpritesheet}
                    disabled={isExporting || !spriteSrc}
                >
                    {isExporting ? "Exportando..." : "Exportar Sprite Sheet"}
                </IonButton>
                <IonButton
                    disabled={isExporting}
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
