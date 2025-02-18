import { IonItem, IonRange } from "@ionic/react";

interface AnimationControlsProps {
    speed: number;
    onSpeedChange: (value: number) => void;
    
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
    speed,
    onSpeedChange,
    
}) => (
    <IonItem>
        <IonRange
            label="Velocidade"
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
        
    </IonItem>
);
