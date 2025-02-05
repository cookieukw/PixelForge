import { IonItem, IonLabel, IonRange } from "@ionic/react";

interface AnimationControlsProps {
    speed: number;
    intensity: number;
    onSpeedChange: (value: number) => void;
    onIntensityChange: (value: number) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
    speed,
    intensity,
    onSpeedChange,
    onIntensityChange
}) => (
    <>
        <IonItem>
            <IonLabel>Velocidade</IonLabel>
            <IonRange
                min={0.5}
                max={4}
                ticks={true}
                pin={true}
                snaps={true}
                step={0.1}
                value={speed}
                pinFormatter={(value: number) => `${value}`}
                onIonChange={e => onSpeedChange(e.detail.value as number)}
            />
            <IonLabel>{speed}</IonLabel>
        </IonItem>
        <IonItem hidden>
            <IonLabel>Intensidade</IonLabel>
            <IonRange
                className="material-slider"
                min={0}
                max={100}
                step={1}
                value={intensity}
                onIonChange={e => onIntensityChange(e.detail.value as number)}
            />
            <IonLabel>{intensity}</IonLabel>
        </IonItem>
    </>
);
