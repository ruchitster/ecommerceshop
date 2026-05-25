// Helper runner to be executed directly with `node`.
// Keeps Jest invocation simple for Windows shell environments.
const { spawnSync } = require('node:child_process')

const result = spawnSync(
  process.execPath,
  ['./node_modules/jest/bin/jest.js', '--runInBand'],
  { stdio: 'inherit', cwd: process.cwd(), env: process.env }
)

process.exit(result.status ?? 1)


