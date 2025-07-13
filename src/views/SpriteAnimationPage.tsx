// src/pages/SpriteAnimationPage.tsx

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
} from "lucide-react";
import { useTheme } from "@/context/themeContext";

export function SpriteAnimationPage() {
  const spriteRef = useRef<HTMLImageElement>(null);

  // Mantendo todos os seus hooks e lógica de estado
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
    isExporting,
    exportProgress,
    resolutionScale,
    setResolutionScale,
  } = useSpriteCapture(backgroundColor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    console.log("[SpriteAnimationPage] Tema alterado:", checked ? "dark" : "light");
  };
  return (
    // O layout principal agora usa divs com Tailwind CSS
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">PixelForge</h1>
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme} // O Switch passa o booleano diretamente
          />
          <Moon className="h-5 w-5" />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda (Preview e Ações) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{currentAnimation}</CardTitle>
              <CardDescription className="h-12">
                {animationDefs[currentAnimation].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* O AnimationSelector é chamado aqui dentro */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="lg"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Selecionar Sprite
            </Button>
            <Button
              onClick={exportSpritesheet}
              disabled={isExporting || !spriteSrc}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting
                ? `Exportando... (${Math.round(exportProgress)}%)`
                : "Exportar Sprite Sheet"}
            </Button>
          </div>
          {isExporting && (
            <Progress value={exportProgress} className="w-full" />
          )}
        </div>

        {/* Coluna da Direita (Controles em Abas) */}
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
              {/* O componente AnimationControls já tem um Card, então ele funciona bem aqui. */}
              <AnimationControls speed={speed} onSpeedChange={setSpeed} />

              {/* Adicionamos a Resolução em outro Card, logo abaixo, na mesma aba. */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Resolução da Exportação</CardTitle>
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
                      <SelectItem value="0.5">Baixa (0.5x)</SelectItem>
                      <SelectItem value="1">Original (1x)</SelectItem>
                      <SelectItem value="2">Alta (2x)</SelectItem>
                      <SelectItem value="4">Máxima (4x)</SelectItem>
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
                    onChangeComplete={(color) => setBackgroundColor(color.hex)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Elementos escondidos permanecem os mesmos */}
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
