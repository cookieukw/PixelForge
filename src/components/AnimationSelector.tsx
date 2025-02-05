import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import { AnimationDefinition} from "../classes/types"
interface AnimationSelectorProps {
    currentAnimation: string;
    animationDefs: Record<string, AnimationDefinition>;
    onSelect: (animation: string) => void;
}

export const AnimationSelector: React.FC<AnimationSelectorProps> = ({
    currentAnimation,
    animationDefs,
    onSelect
}) => (
    <IonSegment
    scrollable={true} 
        color="tertiary"
        value={currentAnimation}
        onIonChange={e => onSelect(e.detail.value as string)}
    >
        {Object.keys(animationDefs).map(key => (
            <IonSegmentButton color="tertiary" key={key} value={key}>
                <IonLabel>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </IonLabel>
            </IonSegmentButton>
        ))}
    </IonSegment>
);
