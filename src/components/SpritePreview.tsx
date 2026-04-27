import { ForwardedRef, forwardRef, memo, useState } from "react";
import { useTranslation } from "../i18n";

interface SpritePreviewProps {
    spriteSrc: string;
    backgroundColor?: string;
    onImageLoad?: () => void;
}

export const SpritePreview = memo(
    forwardRef<HTMLImageElement, SpritePreviewProps>(
        ({ spriteSrc, backgroundColor, onImageLoad }, ref: ForwardedRef<HTMLImageElement>) => {
            const { t } = useTranslation();
            const [imgInfo, setImgInfo] = useState<{
                w: number;
                h: number;
            } | null>(null);

            return (
                <div className="flex flex-col items-center gap-2">
                    <div
                        id="sprite-preview"
                        style={{
                            backgroundColor,
                            border: "2px solid hsl(var(--border))",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            maxWidth: "320px",
                            maxHeight: "320px",
                            width: "100%",
                            aspectRatio: imgInfo ? `${imgInfo.w} / ${imgInfo.h}` : "1 / 1",
                            margin: "0 auto",
                        }}
                    >
                        {spriteSrc ? (
                            <img
                                ref={ref}
                                src={spriteSrc}
                                alt="Sprite"
                                onLoad={(e) => {
                                    setImgInfo({
                                        w: e.currentTarget.naturalWidth,
                                        h: e.currentTarget.naturalHeight,
                                    });
                                    onImageLoad?.();
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    imageRendering: "pixelated",
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 opacity-30"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="text-sm">{t("preview.noSprite")}</span>
                            </div>
                        )}
                    </div>

                    {imgInfo && (
                        <span className="text-xs text-muted-foreground tabular-nums">
                            {imgInfo.w} × {imgInfo.h} px
                        </span>
                    )}
                </div>
            );
        }
    )
);

SpritePreview.displayName = "SpritePreview";
