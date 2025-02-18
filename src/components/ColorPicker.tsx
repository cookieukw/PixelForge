import React, { memo } from "react";
import { ChromePicker } from "react-color";

interface ColorPickerProps {
    color: string;
    onChangeComplete: (color: string) => void;
}

const ColorPicker = memo(({ color, onChangeComplete }: ColorPickerProps) => {
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
                color={color}
                onChangeComplete={onChangeComplete}
                disableAlpha={false}
            />
        </div>
    );
});

export default ColorPicker;
