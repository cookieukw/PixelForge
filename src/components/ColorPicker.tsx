import { memo, useState } from "react";
import { ChromePicker } from "react-color";

interface ColorPickerProps {
    color: string;
    onChange: (hex: string) => void;        // fires on every drag frame → DOM only
    onChangeComplete: (hex: string) => void; // fires when drag ends → React state
}

const ColorPicker = memo(({ color, onChange, onChangeComplete }: ColorPickerProps) => {
    // Local state so the picker's own UI stays in sync while dragging
    const [localColor, setLocalColor] = useState(color);

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <ChromePicker
                color={localColor}
                onChange={(c) => {
                    setLocalColor(c.hex);
                    onChange(c.hex);          // direct DOM update, no React re-render
                }}
                onChangeComplete={(c) => {
                    onChangeComplete(c.hex);  // update React state only when done
                }}
                disableAlpha={false}
            />
        </div>
    );
});

export default ColorPicker;
