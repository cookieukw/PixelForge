// src/components/AnimationSelector.tsx

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AnimationDefinition } from "../classes/types";

interface AnimationSelectorProps {
  currentAnimation: string;
  animationDefs: Record<string, AnimationDefinition>;
  onSelect: (animation: string) => void;
}

export const AnimationSelector: React.FC<AnimationSelectorProps> = ({
  currentAnimation,
  animationDefs,
  onSelect,
}) => {
  return (
    <div className="relative w-full">
      <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ToggleGroup
          type="single"
          value={currentAnimation}
          onValueChange={(value) => {
            if (value) {
              onSelect(value);
            }
          }}
          className="justify-start"
        >
          {Object.keys(animationDefs).map((key) => (
            <ToggleGroupItem
              key={key}
              value={key}
              aria-label={key}
              className="capitalize shrink-0"
            >
              {key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};
