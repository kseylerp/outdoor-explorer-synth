
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Try to import componentTagger, but make it optional to avoid failures
let componentTagger;
try {
  // First try to load from direct path if available
  const lovableTaggerPath = path.join(__dirname, 'node_modules', 'lovable-tagger');
  if (require('fs').existsSync(lovableTaggerPath)) {
    const lovableTagger = require(lovableTaggerPath);
    componentTagger = lovableTagger.componentTagger;
  } else {
    // Otherwise try regular require
    const lovableTagger = require("lovable-tagger");
    componentTagger = lovableTagger.componentTagger;
  }
} catch (e) {
  console.warn("Warning: lovable-tagger not found, continuing without it");
  componentTagger = () => null;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@vitejs/plugin-react-swc'],
    // Add these to help Vite's dependency pre-bundling
    esbuildOptions: {
      target: 'es2020'
    }
  },
}));
