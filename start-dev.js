
#!/usr/bin/env node

console.log("🚀 Starting development server...");

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to check if a command exists
function commandExists(cmd) {
  try {
    execSync(cmd + ' --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Show detailed dependency info
console.log("Checking Node.js environment:");
try {
  const nodeVersion = execSync('node --version').toString().trim();
  console.log(`- Node version: ${nodeVersion}`);
  
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    const pkg = require('./package.json');
    console.log("- Required dependencies:");
    console.log(`  - Vite: ${pkg.dependencies?.vite || pkg.devDependencies?.vite || 'not specified'}`);
    console.log(`  - React: ${pkg.dependencies?.react || 'not specified'}`);
  }
} catch (err) {
  console.log("- Could not determine Node.js environment details");
}

// Force install of vite and required dependencies
console.log("Installing required packages...");
try {
  // Check if npm is available
  if (!commandExists('npm')) {
    console.error("Error: npm is not installed or not in PATH. Please install Node.js and npm.");
    process.exit(1);
  }
  
  // First fix date-fns dependency issue
  console.log("Resolving date-fns dependency conflict...");
  execSync('npm install --no-save date-fns@3.3.1 uuid@latest --legacy-peer-deps', { stdio: 'inherit' });
  
  // Use npm ci for more reliable installations if package-lock exists
  if (fs.existsSync(path.join(__dirname, 'package-lock.json'))) {
    console.log("Using npm ci for installation...");
    execSync('npm ci --no-audit --legacy-peer-deps', { stdio: 'inherit' });
  } else {
    console.log("Using npm install for dependencies...");
    execSync('npm install --no-save --legacy-peer-deps', { stdio: 'inherit' });
  }
  
  // Ensure vite is installed explicitly
  console.log("Ensuring vite is installed...");
  execSync('npm install --no-save vite@latest @vitejs/plugin-react-swc --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log("✓ Dependencies installed successfully");
} catch (err) {
  console.error("Failed with normal install, trying direct vite install:", err);
  try {
    // Direct install of critical packages
    console.log("Attempting direct installation of critical packages...");
    execSync('npm install --no-save uuid@latest date-fns@3.3.1 vite@latest @vitejs/plugin-react-swc --legacy-peer-deps', { 
      stdio: 'inherit'
    });
    console.log("✓ Critical packages installed successfully");
  } catch (innerErr) {
    console.error("Failed to install critical packages:", innerErr);
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
  
  // Try require.resolve as a last resort
  try {
    const vitePath = require.resolve('vite/bin/vite.js');
    console.log(`Found Vite via require.resolve at: ${vitePath}`);
    return vitePath;
  } catch (e) {
    console.log("Could not resolve vite/bin/vite.js with require.resolve");
    return null;
  }
}

// Start the Vite server
console.log("Starting Vite development server...");
const viteExecutable = findViteExecutable();

let viteProcess;
if (viteExecutable) {
  // Use the located vite executable
  const isJsFile = viteExecutable.endsWith('.js');
  if (isJsFile) {
    console.log("Using node to run Vite JS file");
    viteProcess = spawn('node', [viteExecutable], { stdio: 'inherit' });
  } else {
    console.log("Running Vite executable directly");
    viteProcess = spawn(viteExecutable, [], { stdio: 'inherit' });
  }
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
