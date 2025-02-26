import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@fontsource-variable/dm-sans/index.css";
import { I18nProvider } from "react-aria-components";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider locale="en-IN">
    <App />
    </I18nProvider>
  </StrictMode>
);
