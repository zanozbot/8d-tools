import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { generateEightDTemplate } from '../src/templates/default';
import { formatSequenceNumber, generateFileName } from '../src/utils/fileUtils';

describe('8D Tools Tests', () => {

  describe('Template Generation', () => {
    test('should generate a valid 8D template', () => {
      const templateData = {
        title: 'Test Problem',
        sequence: '0001',
        date: '2025-01-01'
      };

      const result = generateEightDTemplate(templateData);

      assert.ok(result.includes('# 0001: Test Problem'));
      assert.ok(result.includes('**Date:** 2025-01-01'));
      assert.ok(result.includes('## D0: Plan and Prepare'));
      assert.ok(result.includes('## D1: Form a Team'));
      assert.ok(result.includes('## D8: Celebrate with Your Team'));
    });

    test('should include links when provided', () => {
      const templateData = {
        title: 'Test Problem',
        sequence: '0002',
        date: '2025-01-01',
        links: ['- Supersedes: [0001: Previous Problem](./0001-previous-problem.md)']
      };

      const result = generateEightDTemplate(templateData);

      assert.ok(result.includes('## Links'));
      assert.ok(result.includes('- Supersedes: [0001: Previous Problem](./0001-previous-problem.md)'));
    });
  });

  describe('Utility Functions', () => {
    test('should format sequence numbers correctly', () => {
      assert.strictEqual(formatSequenceNumber(1), '0001');
      assert.strictEqual(formatSequenceNumber(42), '0042');
      assert.strictEqual(formatSequenceNumber(999), '0999');
      assert.strictEqual(formatSequenceNumber(1000), '1000');
    });

    test('should generate valid filenames', () => {
      assert.strictEqual(
        generateFileName(1, 'Product Quality Issue'),
        '0001-product-quality-issue.md'
      );

      assert.strictEqual(
        generateFileName(42, 'Complex Problem with Special Characters!@#'),
        '0042-complex-problem-with-special-characters.md'
      );

      assert.strictEqual(
        generateFileName(5, 'Multiple   Spaces   and---Dashes'),
        '0005-multiple-spaces-and-dashes.md'
      );
    });
  });

  describe('File Operations', () => {
    let tempDir: string;

    test('should create temporary directory for testing', async () => {
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), '8d-test-'));
      assert.ok(await fs.pathExists(tempDir));
    });

    test('should clean up temporary directory', async () => {
      if (tempDir) {
        await fs.remove(tempDir);
        assert.ok(!(await fs.pathExists(tempDir)));
      }
    });
  });
});