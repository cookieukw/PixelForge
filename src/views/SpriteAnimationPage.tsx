import { useRef, useState } from "react";

import { useAnimation } from "../hooks/useAnimation";
import { useSpriteFile } from "../hooks/useSpriteFile";
import { useSpriteCapture } from "../hooks/useSpriteCapture";
import { useTranslation } from "../i18n";

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
  const { t } = useTranslation();

  const {
    currentAnimation,
    speed,
    setCurrentAnimation,
    setSpeed,
    animationDefs,
    reapplyAnimation,
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
  } = useSpriteCapture(backgroundColor, spriteRef, t);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const progressRounded = Math.round(exportProgress);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("header.title")}</h1>
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
                {t(`animations.${currentAnimation}`)}
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
                  onImageLoad={reapplyAnimation}
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
              {t("actions.selectSprite")}
            </Button>
            <Button
              onClick={exportSpritesheet}
              disabled={isExporting || !spriteSrc}
              size="lg"
              variant="secondary"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting
                ? t("actions.exporting", { progress: progressRounded })
                : t("actions.exportPng")}
            </Button>
            <Button
              onClick={exportGif}
              disabled={isExporting || !spriteSrc}
              size="lg"
            >
              <Clapperboard className="mr-2 h-4 w-4" />
              {isExporting
                ? t("actions.generatingGif", { progress: progressRounded })
                : t("actions.exportGif")}
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
                {t("tabs.settings")}
              </TabsTrigger>
              <TabsTrigger value="color">
                <Palette className="mr-2 h-4 w-4" />
                {t("tabs.colors")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="controls">
              <AnimationControls speed={speed} onSpeedChange={setSpeed} />

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t("resolution.title")}</CardTitle>
                  <CardDescription>
                    {(() => {
                      const size = getExpectedOutputSize();
                      if (!size) return t("resolution.hint");
                      return t("resolution.info", {
                        frameW: size.frameW,
                        frameH: size.frameH,
                        totalW: size.totalW,
                        totalH: size.totalH,
                      });
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
                      <SelectValue placeholder={t("resolution.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">{t("resolution.low")}</SelectItem>
                      <SelectItem value="1">{t("resolution.original")}</SelectItem>
                      <SelectItem value="2">{t("resolution.high")}</SelectItem>
                      <SelectItem value="4">{t("resolution.max")}</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="color">
              <Card>
                <CardHeader>
                  <CardTitle>{t("background.title")}</CardTitle>
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
