
#!/usr/bin/env node

// This script helps ensure Vite is accessible
console.log("Starting Vite development server from helper...");

const path = require('path');
const fs = require('fs');
const { spawnSync, execSync } = require('child_process');

// Try multiple approaches to run Vite
function runVite() {
  // Try approach 1: node_modules/.bin path
  try {
    const binPath = path.join(__dirname, '..', 'node_modules', '.bin', 'vite');
    if (fs.existsSync(binPath)) {
      console.log("Found Vite in node_modules/.bin at:", binPath);
      const result = spawnSync(binPath, [], { 
        stdio: 'inherit',
        shell: true
      });
      if (!result.error) {
        process.exit(result.status || 0);
        return;
      }
    }
  } catch (e) {
    console.log("Could not load Vite from node_modules/.bin/vite");
  }
  
  // Try approach 2: node_modules/vite/bin path
  try {
    const localVitePath = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    if (fs.existsSync(localVitePath)) {
      console.log("Found Vite at:", localVitePath);
      const result = spawnSync('node', [localVitePath], { 
        stdio: 'inherit',
        shell: true 
      });
      if (!result.error) {
        process.exit(result.status || 0);
        return;
      }
    }
  } catch (e) {
    console.log("Could not load Vite from node_modules/vite/bin/vite.js");
  }

  // Try approach 3: require.resolve
  try {
    const vitePath = require.resolve('vite/bin/vite.js');
    console.log("Found Vite using require.resolve at:", vitePath);
    const result = spawnSync('node', [vitePath], { 
      stdio: 'inherit',
      shell: true
    });
    if (!result.error) {
      process.exit(result.status || 0);
      return;
    }
  } catch (e) {
    console.log("Could not resolve vite/bin/vite.js");
  }

  // Try approach 4: emergency reinstall and npx
  try {
    console.log("Attempting emergency reinstall of vite...");
    execSync('npm install --no-save vite @vitejs/plugin-react-swc', { stdio: 'inherit' });
    console.log("Attempting to use npx vite...");
    const result = spawnSync('npx', ['vite'], { 
      stdio: 'inherit',
      shell: true
    });
    
    if (result.error) {
      console.error("Failed to start Vite with npx after reinstall:", result.error);
      process.exit(1);
    }
    
    process.exit(result.status || 0);
  } catch (e) {
    console.error("All vite startup methods failed:", e);
    process.exit(1);
  }
}

runVite();
