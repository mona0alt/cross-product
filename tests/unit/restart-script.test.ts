import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('restart script', () => {
  const restartScript = readFileSync('restart.sh', 'utf8');
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
    dependencies?: Record<string, string>;
  };

  it('uses a project-local PM2 binary after installing dependencies', () => {
    expect(packageJson.dependencies).toHaveProperty('pm2');
    expect(restartScript).toContain('PM2_BIN="./node_modules/.bin/pm2"');
    expect(restartScript).toContain('export PM2_HOME="${PM2_HOME:-$(pwd)/.pm2}"');
    expect(restartScript).toContain('"${PM2_BIN}" describe cross');
    expect(restartScript).not.toContain('\npm2 ');
  });
});
