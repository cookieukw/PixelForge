import { memo, useRef, useState, useEffect, useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AnimationDefinition } from "../classes/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AnimationSelectorProps {
  currentAnimation: string;
  animationDefs: Record<string, AnimationDefinition>;
  onSelect: (animation: string) => void;
}

export const AnimationSelector: React.FC<AnimationSelectorProps> = memo(
  ({ currentAnimation, animationDefs, onSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      updateScrollState();
      el.addEventListener("scroll", updateScrollState, { passive: true });
      const ro = new ResizeObserver(updateScrollState);
      ro.observe(el);
      return () => {
        el.removeEventListener("scroll", updateScrollState);
        ro.disconnect();
      };
    }, [updateScrollState]);

    const scroll = (direction: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollBy({ left: direction === "left" ? -160 : 160, behavior: "smooth" });
    };

    return (
      <div className="relative w-full">
        {/* Left fade + arrow */}
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10",
            "bg-gradient-to-r from-card to-transparent",
            "transition-opacity duration-200",
            canScrollLeft ? "opacity-100" : "opacity-0",
          )}
        />
        <button
          type="button"
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-20",
            "flex items-center justify-center w-6 h-6 rounded-full",
            "bg-background border border-border shadow-sm",
            "hover:bg-accent transition-all duration-200 cursor-pointer",
            canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          className={cn(
            "overflow-x-auto py-1 px-7",
            // Hide native scrollbar on all browsers
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          )}
        >
          <ToggleGroup
            type="single"
            value={currentAnimation}
            onValueChange={(value) => { if (value) onSelect(value); }}
            className="flex justify-start gap-1.5 w-max"
          >
            {Object.keys(animationDefs).map((key) => (
              <ToggleGroupItem
                key={key}
                value={key}
                aria-label={key}
                className="capitalize shrink-0 px-3 h-8 text-xs font-medium"
              >
                {key}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Right fade + arrow */}
        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10",
            "bg-gradient-to-l from-card to-transparent",
            "transition-opacity duration-200",
            canScrollRight ? "opacity-100" : "opacity-0",
          )}
        />
        <button
          type="button"
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-20",
            "flex items-center justify-center w-6 h-6 rounded-full",
            "bg-background border border-border shadow-sm",
            "hover:bg-accent transition-all duration-200 cursor-pointer",
            canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  },
);

AnimationSelector.displayName = "AnimationSelector";
