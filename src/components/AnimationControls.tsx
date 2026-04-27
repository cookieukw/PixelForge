import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Gauge } from "lucide-react";
import { useTranslation } from "../i18n";

interface AnimationControlsProps {
    speed: number;
    onSpeedChange: (value: number) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = memo(({
    speed,
    onSpeedChange,
}) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg">
                    <Gauge className="mr-2 h-5 w-5" />
                    {t("controls.title")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3">
                    <Label htmlFor="speed-slider" className="font-medium">
                        {t("controls.speed", { value: speed.toFixed(1) })}
                    </Label>
                    <Slider
                        id="speed-slider"
                        value={[speed]}
                        onValueChange={(value) => onSpeedChange(value[0])}
                        min={0.5}
                        max={4}
                        step={0.1}
                    />
                </div>
            </CardContent>
        </Card>
    );
});