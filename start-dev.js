
#!/usr/bin/env node

console.log("🚀 Starting development server...");

// First, make sure vite is installed
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if Vite is installed globally or locally
const checkViteInstallation = () => {
  try {
    // Try to find local vite installation
    require.resolve('vite');
    console.log("✓ Vite found locally");
    return true;
  } catch (e) {
    try {
      // Check if it's available globally
      execSync('npx vite --version', { stdio: 'ignore' });
      console.log("✓ Vite found globally via npx");
      return true;
    } catch (err) {
      console.log("⚠️ Vite not found");
      return false;
    }
  }
};

// Install Vite if not found
if (!checkViteInstallation()) {
  console.log("Installing vite and required packages...");
  
  try {
    execSync('npm install --no-save vite @vitejs/plugin-react-swc lovable-tagger', { 
      stdio: 'inherit'
    });
    console.log("✓ Vite installed successfully");
  } catch (err) {
    console.error("Failed to install Vite:", err);
    process.exit(1);
  }
}

// Run Vite
console.log("Starting Vite development server...");
let viteProcess;

// First try to use local vite
try {
  const localVitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  if (fs.existsSync(localVitePath)) {
    viteProcess = spawn('node', [localVitePath], { stdio: 'inherit' });
    console.log("Using local Vite installation");
  } else {
    throw new Error("Local Vite not found");
  }
} catch (e) {
  // Fall back to npx if local fails
  console.log("Falling back to npx vite");
  viteProcess = spawn('npx', ['vite'], { stdio: 'inherit' });
}

viteProcess.on('error', (err) => {
  console.error("Failed to start Vite server:", err);
  process.exit(1);
});

viteProcess.on('exit', (code) => {
  console.log(`Vite server exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\nReceived ${signal}, shutting down...`);
    viteProcess.kill();
  });
});
