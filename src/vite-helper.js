
#!/usr/bin/env node

// This script helps ensure Vite is accessible
console.log("Starting Vite development server...");

try {
  // Try to require vite from node_modules
  require('../node_modules/vite/bin/vite.js');
} catch (e) {
  console.error("Error loading Vite. Please ensure it's installed:");
  console.error(e);
  console.log("Attempting to use global Vite installation...");
  
  // If local vite isn't found, try to use npx
  const { spawnSync } = require('child_process');
  const result = spawnSync('npx', ['vite'], { 
    stdio: 'inherit',
    shell: true
  });
  
  if (result.error) {
    console.error("Failed to start Vite using npx:", result.error);
    process.exit(1);
  }
  
  process.exit(result.status);
}
