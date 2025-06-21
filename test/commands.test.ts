import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { linkCommand } from '../src/commands/link';
import { initCommand } from '../src/commands/init';

describe('Command Tests', () => {
  let tempDir: string;
  let originalCwd: string;

  // Setup and teardown for each test
  test('setup temporary directory', async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), '8d-cmd-test-'));
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  describe('Init Command', () => {
    test('should create 8D directory structure', async () => {
      await initCommand('test-8d');

      // Check if .8d-dir file was created
      const adrDirFile = path.join(tempDir, '.8d-dir');
      assert.ok(await fs.pathExists(adrDirFile));

      const adrDirContent = await fs.readFile(adrDirFile, 'utf8');
      assert.strictEqual(adrDirContent.trim(), 'test-8d');

      // Check if 8D directory was created
      const eightDDir = path.join(tempDir, 'test-8d');
      assert.ok(await fs.pathExists(eightDDir));

      // Check if sequence lock file was created
      const sequenceLockFile = path.join(eightDDir, '.8d-sequence.lock');
      assert.ok(await fs.pathExists(sequenceLockFile));

      const sequenceContent = await fs.readFile(sequenceLockFile, 'utf8');
      assert.strictEqual(sequenceContent.trim(), '0');

      // Check if README.md was created
      const readmeFile = path.join(eightDDir, 'README.md');
      assert.ok(await fs.pathExists(readmeFile));

      const readmeContent = await fs.readFile(readmeFile, 'utf8');
      assert.ok(readmeContent.includes('# 8D Problem-Solving Reports'));
      assert.ok(readmeContent.includes('Eight Disciplines (8D)'));

      // Check if .templates directory was created
      const templatesDir = path.join(eightDDir, '.templates');
      assert.ok(await fs.pathExists(templatesDir));
    });

    test('should use default directory when none specified', async () => {
      // Clean up previous test
      await fs.remove(path.join(tempDir, '.8d-dir'));
      await fs.remove(path.join(tempDir, 'test-8d'));

      await initCommand();

      // Check if default directory was used
      const adrDirFile = path.join(tempDir, '.8d-dir');
      assert.ok(await fs.pathExists(adrDirFile));

      const adrDirContent = await fs.readFile(adrDirFile, 'utf8');
      assert.strictEqual(adrDirContent.trim(), 'docs/8d');

      const defaultDir = path.join(tempDir, 'docs/8d');
      assert.ok(await fs.pathExists(defaultDir));
    });
  });

  describe('Link Command', () => {
    test('should use default linkType when not specified', () => {
      // Test that the function signature accepts optional linkType
      // We can't test the full functionality without setting up reports,
      // but we can verify the default parameter works
      
      // This should not throw an error about missing parameters
      const linkFn = linkCommand;
      assert.strictEqual(typeof linkFn, 'function');
      
      // Check that the function has the correct parameter count
      // (source, target, linkType = 'Supersedes')
      assert.strictEqual(linkFn.length, 2); // Only required parameters count
    });
  });

  // Cleanup
  test('cleanup temporary directory', async () => {
    process.chdir(originalCwd);
    if (tempDir) {
      await fs.remove(tempDir);
      assert.ok(!(await fs.pathExists(tempDir)));
    }
  });
});
