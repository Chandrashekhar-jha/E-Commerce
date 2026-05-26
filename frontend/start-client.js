const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const BASE_PORT = 3002;
const MAX_PORT = 3010;

function findFreePort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => {
      if (port + 1 > MAX_PORT) {
        reject(new Error('No free port found'));
      } else {
        resolve(findFreePort(port + 1));
      }
    });
    server.listen(port, () => {
      const freePort = server.address().port;
      server.close(() => resolve(freePort));
    });
  });
}

(async () => {
  try {
    const port = await findFreePort(BASE_PORT);
    console.log(`Starting frontend on port ${port}...`);

    const env = Object.assign({}, process.env, { PORT: String(port) });
    const frontendPath = path.resolve(__dirname);

    const child = spawn('npm', ['start'], {
      cwd: frontendPath,
      env,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      process.exit(code);
    });
  } catch (error) {
    console.error('Failed to start frontend:', error.message);
    process.exit(1);
  }
})();
