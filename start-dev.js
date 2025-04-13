
#!/usr/bin/env node

console.log("🚀 Starting development server...");

// First, make sure vite is installed
const { execSync, spawn } = require('child_process');

try {
  // Check if vite is available
  console.log("Checking for Vite installation...");
  require.resolve('vite');
  console.log("✓ Vite found locally");
} catch (e) {
  console.log("⚠️ Vite not found locally. Installing vite and required packages...");
  
  try {
    // Install necessary packages
    execSync('npm install --save-dev vite @vitejs/plugin-react-swc', { 
      stdio: 'inherit',
    });
    console.log("✓ Vite installed successfully");
  } catch (err) {
    console.error("Failed to install Vite:", err);
    process.exit(1);
  }
}

// Now start the development server
console.log("Starting Vite development server...");
const viteProcess = spawn('npx', ['vite'], { 
  stdio: 'inherit',
  shell: true
});

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
