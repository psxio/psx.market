import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// import { registerServiceWorker } from "./lib/registerSW";

createRoot(document.getElementById("root")!).render(<App />);

// Temporarily disabled service worker to prevent caching issues
// registerServiceWorker();
