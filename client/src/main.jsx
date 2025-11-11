import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Registrar el service worker
let updateSW;
registerSW({
  onNeedRefresh() {
    if (confirm("Nueva versión disponible. ¿Actualizar ahora?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("App lista para trabajar sin conexión");
  },
  onRegistered(registration) {
    updateSW = registration?.update;
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
