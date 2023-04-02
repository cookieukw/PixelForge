/* Components */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./screens/App";
import CreateProject from "./screens/CreateProject";
import {
  BrowserRouter as Browser,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Container from "./components/Container";
import Homebar from "./components/Homebar";
import Splash from "./screens/Splash";
import { Provider } from "react-redux";

/* Functions */
import store from "./store/index";

/* Css modules */
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Container
      style={{
        flexDirection: "column",
      }}
    >
      <Homebar />
      <Browser>
        <Provider store={store}>
          <Routes>
            <Route path="*" element={<Splash />} />
            <Route path="home" element={<App />} />
            <Route path="create" element={<CreateProject />} />
          </Routes>
        </Provider>
      </Browser>
    </Container>
  </React.StrictMode>
);
