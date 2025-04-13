
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure we have a root element to render into
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found. Creating one...");
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);
}

createRoot(document.getElementById("root")!).render(<App />);
