import { createRoot } from "react-dom/client";
import "animate.css";
import "./index.css";

import App from "./views/SpriteAnimationPage.tsx";
import { ThemeProvider } from "./context/themeContext";
import { I18nProvider } from "./i18n";

createRoot(document.getElementById("root")!).render(
    <I18nProvider>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </I18nProvider>
);
