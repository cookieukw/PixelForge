import { createRoot } from "react-dom/client";
import "animate.css";
import "./index.css";

import App from "./views/SpriteAnimationPage.tsx";
import { ThemeProvider } from "./context/themeContext";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);
