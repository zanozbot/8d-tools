import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { generateEightDTemplate } from '../src/templates/default';
import { generateSimpleTemplate } from '../src/templates/simple';
import { formatSequenceNumber, generateFileName } from '../src/utils/fileUtils';
import {
  generateReportFromTemplate
} from '../src/utils/templateUtils';
import { getReverseLink } from '../src/utils/linkUtils';

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

    test('should generate a valid simple template', () => {
      const templateData = {
        title: 'Simple Test Problem',
        sequence: '0003',
        date: '2025-01-01'
      };

      const result = generateSimpleTemplate(templateData);

      assert.ok(result.includes('# 0003: Simple Test Problem'));
      assert.ok(result.includes('**Date:** 2025-01-01'));
      assert.ok(result.includes('## Problem Description'));
      assert.ok(result.includes('## Root Cause Analysis'));
      assert.ok(result.includes('## Solution'));
      assert.ok(result.includes('## Prevention'));
      assert.ok(result.includes('## Lessons Learned'));
    });

    test('should include links in simple template when provided', () => {
      const templateData = {
        title: 'Simple Test Problem',
        sequence: '0004',
        date: '2025-01-01',
        links: ['- Related to: [0003: Previous Simple Problem](./0003-previous-simple-problem.md)']
      };

      const result = generateSimpleTemplate(templateData);

      assert.ok(result.includes('## Links'));
      assert.ok(result.includes('- Related to: [0003: Previous Simple Problem](./0003-previous-simple-problem.md)'));
    });
  });

  describe('Template Utilities (Unit Tests)', () => {
    test('should generate report from default template directly', async () => {
      const data = {
        title: 'Test Report',
        sequence: '0001',
        date: '2025-01-01',
        links: ['- Related to: [0002: Other Report](./0002-other-report.md)']
      };

      const result = await generateReportFromTemplate('default', data);

      assert.ok(result.includes('# 0001: Test Report'));
      assert.ok(result.includes('**Date:** 2025-01-01'));
      assert.ok(result.includes('## D0: Plan and Prepare'));
      assert.ok(result.includes('## Links'));
      assert.ok(result.includes('- Related to: [0002: Other Report](./0002-other-report.md)'));
    });

    test('should generate report from simple template directly', async () => {
      const data = {
        title: 'Simple Test',
        sequence: '0002',
        date: '2025-01-01'
      };

      const result = await generateReportFromTemplate('simple', data);

      assert.ok(result.includes('# 0002: Simple Test'));
      assert.ok(result.includes('**Date:** 2025-01-01'));
      assert.ok(result.includes('## Problem Description'));
      assert.ok(result.includes('## Root Cause Analysis'));
      assert.ok(result.includes('## Solution'));
      assert.ok(result.includes('## Prevention'));
      assert.ok(result.includes('## Lessons Learned'));
    });

    // Note: Testing nonexistent templates requires 8D directory setup
    // This is covered in integration tests
  });

  describe('Link Utilities', () => {
    test('should return correct reverse links', () => {
      assert.strictEqual(getReverseLink('Supersedes'), 'Superseded by');
      assert.strictEqual(getReverseLink('Superseded by'), 'Supersedes');
      assert.strictEqual(getReverseLink('Related to'), 'Related to');
      assert.strictEqual(getReverseLink('Amends'), 'Amended by');
      assert.strictEqual(getReverseLink('Amended by'), 'Amends');
      assert.strictEqual(getReverseLink('Clarifies'), 'Clarified by');
      assert.strictEqual(getReverseLink('Clarified by'), 'Clarifies');
      assert.strictEqual(getReverseLink('Extends'), 'Extended by');
      assert.strictEqual(getReverseLink('Extended by'), 'Extends');
    });

    test('should return default reverse link for unknown types', () => {
      assert.strictEqual(getReverseLink('Unknown Type'), 'Related to');
      assert.strictEqual(getReverseLink('Custom Link'), 'Related to');
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