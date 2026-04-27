
import { useRef, useState } from "react";

import { useAnimation } from "../hooks/useAnimation";
import { useSpriteFile } from "../hooks/useSpriteFile";
import { useSpriteCapture } from "../hooks/useSpriteCapture";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnimationSelector } from "../components/AnimationSelector";
import { AnimationControls } from "../components/AnimationControls";
import { SpritePreview } from "../components/SpritePreview";
import ColorPicker from "../components/ColorPicker";

import {
  Sun,
  Moon,
  Palette,
  Settings,
  Image as ImageIcon,
  Download,
  Clapperboard,
} from "lucide-react";
import { useTheme } from "@/context/themeContext";

export function SpriteAnimationPage() {
  const spriteRef = useRef<HTMLImageElement>(null);

  const {
    currentAnimation,
    speed,
    setCurrentAnimation,
    setSpeed,
    animationDefs,
  } = useAnimation(spriteRef);
  const { setTheme, theme } = useTheme();
  const { spriteSrc, handleFileChange } = useSpriteFile();
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const {
    canvasRef,
    exportSpritesheet,
    exportGif,
    isExporting,
    exportProgress,
    resolutionScale,
    setResolutionScale,
    getExpectedOutputSize,
  } = useSpriteCapture(backgroundColor, spriteRef);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    console.log("[SpriteAnimationPage] Tema alterado:", checked ? "dark" : "light");
  };
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">PixelForge</h1>
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
          <Moon className="h-5 w-5" />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{currentAnimation}</CardTitle>
              <CardDescription className="h-12">
                {animationDefs[currentAnimation].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimationSelector
                currentAnimation={currentAnimation}
                animationDefs={animationDefs}
                onSelect={setCurrentAnimation}
              />
              <div className="mt-4">
                <SpritePreview
                  spriteSrc={spriteSrc}
                  ref={spriteRef}
                  backgroundColor={backgroundColor}
                />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="lg"
              className="sm:col-span-1"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Selecionar Sprite
            </Button>
            <Button
              onClick={exportSpritesheet}
              disabled={isExporting || !spriteSrc}
              size="lg"
              variant="secondary"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting
                ? `Exportando... (${Math.round(exportProgress)}%)`
                : "Exportar PNG"}
            </Button>
            <Button
              onClick={exportGif}
              disabled={isExporting || !spriteSrc}
              size="lg"
            >
              <Clapperboard className="mr-2 h-4 w-4" />
              {isExporting
                ? `Gerando GIF... (${Math.round(exportProgress)}%)`
                : "Exportar GIF"}
            </Button>
          </div>
          {isExporting && (
            <Progress value={exportProgress} className="w-full" />
          )}
        </div>

        <div className="lg:col-span-1">
          <Tabs defaultValue="controls" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="controls">
                <Settings className="mr-2 h-4 w-4" />
                Ajustes
              </TabsTrigger>
              <TabsTrigger value="color">
                <Palette className="mr-2 h-4 w-4" />
                Cores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="controls">
              <AnimationControls speed={speed} onSpeedChange={setSpeed} />

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Resolução da Exportação</CardTitle>
                  <CardDescription>
                    {(() => {
                      const size = getExpectedOutputSize();
                      if (!size) return "Carregue um sprite para ver as dimensões de saída.";
                      return `Frame: ${size.frameW}×${size.frameH}px · Sheet: ${size.totalW}×${size.totalH}px`;
                    })()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={String(resolutionScale)}
                    onValueChange={(value) =>
                      setResolutionScale(Number(value) as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a resolução" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">Baixa (0.5×)</SelectItem>
                      <SelectItem value="1">Original (1×)</SelectItem>
                      <SelectItem value="2">Alta (2×)</SelectItem>
                      <SelectItem value="4">Máxima (4×)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="color">
              <Card>
                <CardHeader>
                  <CardTitle>Cor de Fundo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ColorPicker
                    color={backgroundColor}
                    onChange={(hex) => {
                      const preview = document.getElementById("sprite-preview");
                      if (preview) preview.style.backgroundColor = hex;
                    }}
                    onChangeComplete={(hex) => setBackgroundColor(hex)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default SpriteAnimationPage;
