import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Force unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log("Service worker unregistered");
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
