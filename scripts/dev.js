const { spawn, spawnSync } = require('child_process');
const path = require('path');
const concurrently = require('concurrently');

const root = path.join(__dirname, '..');
const docker = spawnSync('docker', ['compose', 'up', '-d', 'mongo'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

if (docker.status !== 0) {
  console.warn('Could not start Mongo via Docker. Start Mongo yourself on port 27017, or install Docker.');
}

const { result } = concurrently(
  [
    {
      name: 'api',
      command: 'npm run dev',
      cwd: path.join(root, 'Assignment', 'eComBackend'),
    },
    {
      name: 'web',
      command: 'npm run dev',
      cwd: path.join(root, 'Assignment', 'eComFrontend'),
    },
  ],
  {
    prefixColors: ['blue', 'green'],
    killOthersOn: ['failure', 'success'],
    cwd: root,
  }
);

result.then(
  () => process.exit(0),
  () => process.exit(1)
);

process.on('SIGINT', () => {
  spawn('docker', ['compose', 'stop', 'mongo'], { cwd: root, shell: true, stdio: 'inherit' });
});
