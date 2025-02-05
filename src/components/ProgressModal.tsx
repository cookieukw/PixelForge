import {
    IonModal,
    IonProgressBar,
    IonTitle,
    IonContent,
    IonLabel
} from "@ionic/react";

interface ProgressModalProps {
    isOpen: boolean;
    progress: number;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
    isOpen,
    progress
}) => {
    
    return (
        <IonModal isOpen={isOpen}>
            <IonContent className="ion-padding">
                <IonTitle>Exportando Spritesheet</IonTitle>
                <IonProgressBar value={progress}></IonProgressBar>
                <IonLabel
                    className="ion-text-center"
                    style={{ display: "block", marginTop: "1rem" }}
                >
                    {Math.round(progress)}% Completo
                </IonLabel>
            </IonContent>
        </IonModal>
    );
};
