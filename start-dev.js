
#!/usr/bin/env node

console.log("🚀 Starting development server...");

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Force install of vite and required dependencies
console.log("Installing required packages...");
try {
  // Use npm ci for more reliable installations if package-lock exists
  if (fs.existsSync(path.join(__dirname, 'package-lock.json'))) {
    console.log("Using npm ci for installation...");
    execSync('npm ci --no-audit', { stdio: 'inherit' });
  } else {
    console.log("Using npm install for dependencies...");
    execSync('npm install --no-save', { stdio: 'inherit' });
  }
  console.log("✓ Dependencies installed successfully");
} catch (err) {
  console.error("Failed with normal install, trying direct vite install:", err);
  try {
    // Direct install of critical packages
    execSync('npm install --no-save vite @vitejs/plugin-react-swc', { 
      stdio: 'inherit'
    });
    console.log("✓ Vite installed successfully");
  } catch (innerErr) {
    console.error("Failed to install Vite:", innerErr);
    process.exit(1);
  }
}

// Function to find the vite executable
function findViteExecutable() {
  const possiblePaths = [
    path.join(__dirname, 'node_modules', '.bin', 'vite'),
    path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js'),
  ];
  
  for (const vitePath of possiblePaths) {
    if (fs.existsSync(vitePath)) {
      console.log(`Found Vite at: ${vitePath}`);
      return vitePath;
    }
  }
  
  return null;
}

// Start the Vite server
console.log("Starting Vite development server...");
const viteExecutable = findViteExecutable();

let viteProcess;
if (viteExecutable) {
  // Use the located vite executable
  viteProcess = spawn('node', [viteExecutable], { stdio: 'inherit' });
} else {
  // Fallback to using node to run our vite-helper.js
  console.log("Vite executable not found directly, using helper script...");
  const helperPath = path.join(__dirname, 'src', 'vite-helper.js');
  viteProcess = spawn('node', [helperPath], { stdio: 'inherit' });
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
