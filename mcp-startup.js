const { spawn } = require('child_process');
const path = require('path');

// Set environment variables to disable all colors
const env = {
    ...process.env,
    NO_COLOR: "true",
    FORCE_COLOR: "0",
    NODE_ENV: "production",
    TERM: "dumb"
};

// Start the server process
console.error('Starting server...');
const server = spawn('node', ['build/server.js'], {
    cwd: path.resolve(__dirname),
    env: env,
    // Redirect stdin from our stdin, 
    // but pipe stdout so we can filter it,
    // and pass stderr through directly
    stdio: ['inherit', 'pipe', 'inherit']
});

// Strict JSON-only filtering for stdout
server.stdout.on('data', (data) => {
    const output = data.toString().trim();

    // Only pass valid JSON-RPC messages
    if (output.includes('"jsonrpc":"2.0"') || output.includes('"jsonrpc": "2.0"')) {
        process.stdout.write(data);
    } else {
        console.error('Filtered non-JSON-RPC output');
    }
});

// Handle server exit
server.on('close', (code) => {
    console.error(`Server process exited with code ${code}`);
    process.exit(code);
});

// Handle process signals
['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
        console.error(`Received ${signal}, shutting down...`);
        server.kill(signal);
    });
});