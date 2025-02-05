
import { createRoot } from "react-dom/client";import 'animate.css';
import "./index.css";
//import App from "./App.tsx";
import App from "./views/SpriteAnimationPage.tsx";

import "@ionic/react/css/core.css";
import { setupIonicReact } from "@ionic/react";
setupIonicReact();
createRoot(document.getElementById("root")!).render(<App />);
