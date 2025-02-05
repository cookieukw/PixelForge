
import { ForwardedRef, forwardRef } from 'react';

interface SpritePreviewProps {
  spriteSrc: string;
}

export const SpritePreview = forwardRef<HTMLImageElement, SpritePreviewProps>(
  ({ spriteSrc }, ref: ForwardedRef<HTMLImageElement>) => (
    <div 
      id="sprite-preview" 
      style={{
        width: "150px",
        height: "150px",
        backgroundColor: "#ddd",
        margin: "10px auto",
        border: "2px solid #333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      {spriteSrc ? (
        <img
          ref={ref}
          src={spriteSrc}
          alt="Sprite"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      ) : (
        <p>Sem Sprite</p>
      )}
    </div>
  )
);

// Adiciona display name para melhor debugging
SpritePreview.displayName = 'SpritePreview';