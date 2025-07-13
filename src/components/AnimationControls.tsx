// src/components/AnimationControls.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Gauge } from "lucide-react"; // Importando um ícone para o título

interface AnimationControlsProps {
    speed: number;
    onSpeedChange: (value: number) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
    speed,
    onSpeedChange,
}) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center text-lg">
                <Gauge className="mr-2 h-5 w-5" />
                Controles
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-3">
                <Label htmlFor="speed-slider" className="font-medium">
                    Velocidade: {speed.toFixed(1)}s
                </Label>
                <Slider
                    id="speed-slider"
                    value={[speed]} // O Slider espera um array como valor
                    onValueChange={(value) => onSpeedChange(value[0])} // Pegamos o primeiro item do array
                    min={0.5}
                    max={4}
                    step={0.1}
                />
            </div>
        </CardContent>
    </Card>
);