import { useRef, useCallback, useState, useEffect } from "react";

import {
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonPage,
    IonList,
    IonLabel,
    IonToggle,
    IonContent,
    IonButton,
    useIonViewWillEnter,
    IonHeader,
    IonToolbar,
    IonTitle,
    ToggleCustomEvent
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";

//import "swiper/css/pagination";
//import "swiper/css/navigation";
import { useTheme } from "../hooks/useTheme";
import { Pagination, Navigation } from "swiper/modules";
import { initializeAdmob, showInterstitial } from "../classes/admob";
import ColorPicker from "../components/ColorPicker";
import { useAnimation } from "../hooks/useAnimation";
import { useSpriteFile } from "../hooks/useSpriteFile";
import { useSpriteCapture } from "../hooks/useSpriteCapture";
import { AnimationSelector } from "../components/AnimationSelector";
import { SpritePreview } from "../components/SpritePreview";
import { AnimationControls } from "../components/AnimationControls";

import { StatusBar, Style } from "@capacitor/status-bar";
const SpriteAnimationPage: React.FC = () => {
    const spriteRef = useRef<HTMLImageElement>(null);
    const {
        currentAnimation,
        speed,
        setCurrentAnimation,
        setSpeed,
        animationDefs
    } = useAnimation(spriteRef);

    const { isDarkMode, toggleTheme } = useTheme();
    const handleThemeToggle = (event: ToggleCustomEvent) => {
        toggleTheme(event.detail.checked);
    };
    const { spriteSrc, handleFileChange } = useSpriteFile();
    const [backgroundColor, setBackgroundColor] =
        useState<string>("transparent");
    const {
        canvasRef,
        exportSpritesheet,
        isExporting,
        exportProgress,
        resolutionScale,
        setResolutionScale
    } = useSpriteCapture(backgroundColor);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    useIonViewWillEnter(() => {
        initializeAdmob();
        showInterstitial();
    });
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                toggleTheme(e.matches);
            }
        };

        // Listener para mudanças no sistema
        mediaQuery.addEventListener("change", handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
    }, []);

    useIonViewWillEnter(() => {
        StatusBar.setStyle({
            style: isDarkMode ? Style.Dark : Style.Light
        });
        StatusBar.setBackgroundColor({
            color: isDarkMode ? "#1a1a1a" : "#ffffff"
        });
    });
    return (
        <IonPage className="ion-padding" >
            <IonHeader>
                <IonToolbar
                    style={{
                        //  fontSize: "10px",
                        padding: 0,
                        margin: 0,

                        borderTop: "1px solid white",
                        textAlign: "center"
                    }}
                >
                    <IonTitle
                        style={{
                            margin: 0,

                            padding: 0
                        }}
                    >
                        PixelForge{" "}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
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
                        <SwiperSlide>
                            <IonItem>
                                <IonToggle
                                    checked={isDarkMode}
                                    onIonChange={handleThemeToggle}
                                    slot="end"
                                    enableOnOffLabels={true}
                                >
                                    Modo escuro
                                </IonToggle>
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
