import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { generateEightDTemplate, TemplateData } from '../src/templates/default';
import { generateSimpleTemplate, SimpleTemplateData } from '../src/templates/simple';

describe('Template Tests', () => {

  describe('Default Template', () => {
    test('should generate complete 8D template', () => {
      const data: TemplateData = {
        title: 'Manufacturing Defect',
        sequence: '0001',
        date: '2025-01-15'
      };

      const result = generateEightDTemplate(data);

      // Check header
      assert.ok(result.includes('# 0001: Manufacturing Defect'));
      assert.ok(result.includes('**Date:** 2025-01-15'));
      assert.ok(result.includes('**Status:** Draft'));

      // Check all 8D sections are present
      assert.ok(result.includes('## D0: Plan and Prepare'));
      assert.ok(result.includes('## D1: Form a Team'));
      assert.ok(result.includes('## D2: Identify the Problem'));
      assert.ok(result.includes('## D3: Develop Interim Containment Plan'));
      assert.ok(result.includes('## D4: Verify Root Causes and Escape Points'));
      assert.ok(result.includes('## D5: Choose Permanent Corrective Actions'));
      assert.ok(result.includes('## D6: Implement Corrective Actions'));
      assert.ok(result.includes('## D7: Take Preventive Measures'));
      assert.ok(result.includes('## D8: Celebrate with Your Team'));

      // Check specific subsections
      assert.ok(result.includes('### Problem Background'));
      assert.ok(result.includes('### Team Members'));
      assert.ok(result.includes('### 5W2H Analysis'));
      assert.ok(result.includes('### Root Cause Analysis'));
      assert.ok(result.includes('### Implementation Plan'));
      assert.ok(result.includes('### Team Recognition'));

      // Check footer
      assert.ok(result.includes('*This 8D report was generated using [8d-tools]'));
    });

    test('should include links section when links provided', () => {
      const data: TemplateData = {
        title: 'Quality Issue Follow-up',
        sequence: '0002',
        date: '2025-01-15',
        links: [
          '- Supersedes: [0001: Original Quality Issue](./0001-original-quality-issue.md)',
          '- Related to: [0003: Process Improvement](./0003-process-improvement.md)'
        ]
      };

      const result = generateEightDTemplate(data);

      assert.ok(result.includes('## Links'));
      assert.ok(result.includes('- Supersedes: [0001: Original Quality Issue](./0001-original-quality-issue.md)'));
      assert.ok(result.includes('- Related to: [0003: Process Improvement](./0003-process-improvement.md)'));
    });

    test('should not include links section when no links provided', () => {
      const data: TemplateData = {
        title: 'Standalone Issue',
        sequence: '0003',
        date: '2025-01-15'
      };

      const result = generateEightDTemplate(data);

      assert.ok(!result.includes('## Links'));
    });
  });

  describe('Simple Template', () => {
    test('should generate streamlined template', () => {
      const data: SimpleTemplateData = {
        title: 'Quick Fix Required',
        sequence: '0004',
        date: '2025-01-15'
      };

      const result = generateSimpleTemplate(data);

      // Check header
      assert.ok(result.includes('# 0004: Quick Fix Required'));
      assert.ok(result.includes('**Date:** 2025-01-15'));
      assert.ok(result.includes('**Status:** Draft'));

      // Check simple sections
      assert.ok(result.includes('## Problem Description'));
      assert.ok(result.includes('## Root Cause Analysis'));
      assert.ok(result.includes('## Solution'));
      assert.ok(result.includes('## Prevention'));
      assert.ok(result.includes('## Lessons Learned'));

      // Check comments are present
      assert.ok(result.includes('<!-- Describe the problem clearly and concisely -->'));
      assert.ok(result.includes('<!-- Identify the root cause of the problem -->'));
      assert.ok(result.includes('<!-- Describe the solution implemented -->'));
      assert.ok(result.includes('<!-- What measures will prevent this problem from recurring? -->'));
      assert.ok(result.includes('<!-- Key takeaways from this problem-solving process -->'));

      // Check footer
      assert.ok(result.includes('*This 8D report was generated using [8d-tools]'));

      // Ensure it doesn't include full 8D sections
      assert.ok(!result.includes('## D0: Plan and Prepare'));
      assert.ok(!result.includes('## D1: Form a Team'));
      assert.ok(!result.includes('### 5W2H Analysis'));
    });

    test('should include links section when links provided', () => {
      const data: SimpleTemplateData = {
        title: 'Emergency Fix',
        sequence: '0005',
        date: '2025-01-15',
        links: ['- Amends: [0004: Original Fix](./0004-original-fix.md)']
      };

      const result = generateSimpleTemplate(data);

      assert.ok(result.includes('## Links'));
      assert.ok(result.includes('- Amends: [0004: Original Fix](./0004-original-fix.md)'));
    });

    test('should handle empty links array', () => {
      const data: SimpleTemplateData = {
        title: 'Independent Fix',
        sequence: '0006',
        date: '2025-01-15',
        links: []
      };

      const result = generateSimpleTemplate(data);

      assert.ok(!result.includes('## Links'));
    });
  });

  describe('Template Comparison', () => {
    test('default template should be longer than simple template', () => {
      const data = {
        title: 'Test Problem',
        sequence: '0001',
        date: '2025-01-15'
      };

      const defaultResult = generateEightDTemplate(data);
      const simpleResult = generateSimpleTemplate(data);

      assert.ok(defaultResult.length > simpleResult.length);
    });

    test('both templates should have consistent header format', () => {
      const data = {
        title: 'Consistency Test',
        sequence: '0007',
        date: '2025-01-15'
      };

      const defaultResult = generateEightDTemplate(data);
      const simpleResult = generateSimpleTemplate(data);

      // Both should have the same header format
      assert.ok(defaultResult.includes('# 0007: Consistency Test'));
      assert.ok(simpleResult.includes('# 0007: Consistency Test'));
      
      assert.ok(defaultResult.includes('**Date:** 2025-01-15'));
      assert.ok(simpleResult.includes('**Date:** 2025-01-15'));
      
      assert.ok(defaultResult.includes('**Status:** Draft'));
      assert.ok(simpleResult.includes('**Status:** Draft'));
    });

    test('both templates should handle special characters in titles', () => {
      const data = {
        title: 'Problem with "Quotes" & Special Characters!',
        sequence: '0008',
        date: '2025-01-15'
      };

      const defaultResult = generateEightDTemplate(data);
      const simpleResult = generateSimpleTemplate(data);

      assert.ok(defaultResult.includes('# 0008: Problem with "Quotes" & Special Characters!'));
      assert.ok(simpleResult.includes('# 0008: Problem with "Quotes" & Special Characters!'));
    });
  });
});
