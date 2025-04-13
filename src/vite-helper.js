
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
    console.log("Looking for Vite at:", binPath);
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
    } else {
      console.log("Vite not found at expected location:", binPath);
    }
  } catch (e) {
    console.log("Could not load Vite from node_modules/.bin/vite:", e.message);
  }
  
  // Try approach 2: node_modules/vite/bin path
  try {
    const localVitePath = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    console.log("Looking for Vite at:", localVitePath);
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
    } else {
      console.log("Vite not found at:", localVitePath);
    }
  } catch (e) {
    console.log("Could not load Vite from node_modules/vite/bin/vite.js:", e.message);
  }

  // Try approach 3: require.resolve
  try {
    console.log("Attempting to locate Vite via require.resolve...");
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
    console.log("Could not resolve vite/bin/vite.js:", e.message);
  }

  // Try approach 4: emergency reinstall and npx
  try {
    console.log("Attempting emergency reinstall of vite and date-fns...");
    // First install a compatible date-fns version for react-day-picker
    execSync('npm install --no-save date-fns@3.3.1 --legacy-peer-deps', { stdio: 'inherit' });
    // Then install vite
    execSync('npm install --no-save vite@latest @vitejs/plugin-react-swc --legacy-peer-deps', { stdio: 'inherit' });
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
