
#!/usr/bin/env node

console.log('Starting Vite development server...');
try {
  // Try to require vite dynamically
  const vite = require('vite');
  
  // Start the server with default options
  vite.createServer().then(server => {
    server.listen().then(() => {
      console.log('Vite server is running');
    });
  });
} catch (error) {
  console.error('Failed to start Vite:', error);
  
  // Attempt to run vite from node_modules/.bin
  const { spawn } = require('child_process');
  const path = require('path');
  
  try {
    const viteBin = path.join(__dirname, '..', 'node_modules', '.bin', 'vite');
    const viteProcess = spawn(viteBin, { stdio: 'inherit', shell: true });
    
    viteProcess.on('error', err => {
      console.error('Error starting Vite from bin:', err);
    });
  } catch (binError) {
    console.error('Could not start Vite from bin:', binError);
    process.exit(1);
  }
}
