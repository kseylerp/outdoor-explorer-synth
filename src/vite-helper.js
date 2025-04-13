
#!/usr/bin/env node

// This script helps ensure Vite is accessible
console.log("Starting Vite development server from helper...");

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

// Try multiple approaches to run Vite
function runVite() {
  // Try approach 1: node_modules path
  try {
    const localVitePath = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    if (fs.existsSync(localVitePath)) {
      console.log("Found Vite at:", localVitePath);
      require(localVitePath);
      return;
    }
  } catch (e) {
    console.log("Could not load Vite from node_modules/vite/bin/vite.js");
  }

  // Try approach 2: require.resolve
  try {
    const vitePath = require.resolve('vite/bin/vite.js');
    console.log("Found Vite using require.resolve at:", vitePath);
    require(vitePath);
    return;
  } catch (e) {
    console.log("Could not resolve vite/bin/vite.js");
  }

  // Try approach 3: use npx
  console.log("Attempting to use npx vite...");
  const result = spawnSync('npx', ['vite'], { 
    stdio: 'inherit',
    shell: true
  });
  
  if (result.error) {
    console.error("Failed to start Vite with npx:", result.error);
    process.exit(1);
  }
  
  process.exit(result.status || 0);
}

runVite();
