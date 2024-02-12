import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./i18n.js";
import "./index.css";

async function deferRender() {
   if (import.meta.env.VITE_USE_MOCKS !== "true") {
      return;
   }

   const { worker } = await import("../../../mocks/browser.js");
   return worker.start();
}

deferRender().then(() => {
   ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
         <App />
      </React.StrictMode>
   );
});
