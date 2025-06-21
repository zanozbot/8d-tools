import { test, describe, expect } from "vitest";
import fs from "fs-extra";
import { join } from "path";
import { tmpdir } from "os";
import { generateEightDTemplate, TemplateData } from "../src/templates/default";
import {
  generateSimpleTemplate,
  SimpleTemplateData,
} from "../src/templates/simple";

describe("Template Tests", () => {
  let tempDir: string;
  let originalCwd: string;

  // Setup before all tests
  test("setup test environment", async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), "8d-template-test-"));
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  describe("Default Template", () => {
    test("should generate complete 8D template", () => {
      const data: TemplateData = {
        title: "Manufacturing Defect",
        sequence: "0001",
        date: "2025-01-15",
      };

      const result = generateEightDTemplate(data);

      // Check header
      expect(result).toContain("# 0001: Manufacturing Defect");
      expect(result).toContain("**Date:** 2025-01-15");
      expect(result).toContain("**Status:** Draft");

      // Check all 8D sections are present
      expect(result).toContain("## D0: Plan and prepare");
      expect(result).toContain("## D1: Form a team");
      expect(result).toContain("## D2: Identify the problem");
      expect(result).toContain("## D3: Develop interim containment plan");
      expect(result).toContain("## D4: Verify root causes and escape points");
      expect(result).toContain("## D5: Choose permanent corrective actions");
      expect(result).toContain("## D6: Implement corrective actions");
      expect(result).toContain("## D7: Take preventive measures");
      expect(result).toContain("## D8: Celebrate with your team");

      // Check specific subsections
      expect(result).toContain("### Problem background");
      expect(result).toContain("### Team members");
      expect(result).toContain("### 5W2H analysis");
      expect(result).toContain("### Root cause analysis");
      expect(result).toContain("### Implementation plan");
      expect(result).toContain("### Team recognition");

      // Check footer
      expect(result).toContain(
        "*This 8D report was generated using [8d-tools]"
      );
    });

    test("should include links section when links provided", () => {
      const data: TemplateData = {
        title: "Quality Issue Follow-up",
        sequence: "0002",
        date: "2025-01-15",
        links: [
          "- Supersedes: [0001: Original Quality Issue](./0001-original-quality-issue.md)",
          "- Related to: [0003: Process Improvement](./0003-process-improvement.md)",
        ],
      };

      const result = generateEightDTemplate(data);

      expect(result).toContain("## Links");
      expect(result).toContain(
        "- Supersedes: [0001: Original Quality Issue](./0001-original-quality-issue.md)"
      );
      expect(result).toContain(
        "- Related to: [0003: Process Improvement](./0003-process-improvement.md)"
      );
    });

    test("should not include links section when no links provided", () => {
      const data: TemplateData = {
        title: "Standalone Issue",
        sequence: "0003",
        date: "2025-01-15",
      };

      const result = generateEightDTemplate(data);

      expect(result).not.toContain("## Links");
    });
  });

  describe("Simple Template", () => {
    test("should generate streamlined template", () => {
      const data: SimpleTemplateData = {
        title: "Quick Fix Required",
        sequence: "0004",
        date: "2025-01-15",
      };

      const result = generateSimpleTemplate(data);

      // Check header
      expect(result).toContain("# 0004: Quick Fix Required");
      expect(result).toContain("**Date:** 2025-01-15");
      expect(result).toContain("**Status:** Draft");

      // Check simple sections
      expect(result).toContain("## D0: Planning");
      expect(result).toContain("## D1: Team members");
      expect(result).toContain("## D2: Problem statement & description");
      expect(result).toContain("## D4: Root cause & escape points");
      expect(result).toContain("## D7: Preventive measures");

      // Check comments are present
      expect(result).toContain(
        "<!-- Gather data, feedback, and prerequisites required to solve the problem. -->"
      );
      expect(result).toContain("<!-- List team members and their roles -->");
      expect(result).toContain(
        "<!-- Describe the problem clearly and concisely -->"
      );
      expect(result).toContain(
        "<!-- Identify all possible root causes and escape points for the problem. -->"
      );
      expect(result).toContain(
        "<!-- Describe any measure to implement to avoid similar problems in the future. -->"
      );

      // Check footer
      expect(result).toContain(
        "*This 8D report was generated using [8d-tools]"
      );

      // Ensure it doesn't include detailed 8D subsections from default template
      expect(result).not.toContain("### Problem background");
      expect(result).not.toContain("### 5W2H analysis");
      expect(result).not.toContain("### Potential root causes");
    });

    test("should include links section when links provided", () => {
      const data: SimpleTemplateData = {
        title: "Emergency Fix",
        sequence: "0005",
        date: "2025-01-15",
        links: ["- Amends: [0004: Original Fix](./0004-original-fix.md)"],
      };

      const result = generateSimpleTemplate(data);

      expect(result).toContain("## Links");
      expect(result).toContain(
        "- Amends: [0004: Original Fix](./0004-original-fix.md)"
      );
    });

    test("should handle empty links array", () => {
      const data: SimpleTemplateData = {
        title: "Independent Fix",
        sequence: "0006",
        date: "2025-01-15",
        links: [],
      };

      const result = generateSimpleTemplate(data);

      expect(result).not.toContain("## Links");
    });
  });

  describe("Template Comparison", () => {
    test("default template should be longer than simple template", () => {
      const data = {
        title: "Test Problem",
        sequence: "0001",
        date: "2025-01-15",
      };

      const defaultResult = generateEightDTemplate(data);
      const simpleResult = generateSimpleTemplate(data);

      expect(defaultResult.length).toBeGreaterThan(simpleResult.length);
    });

    test("both templates should have consistent header format", () => {
      const data = {
        title: "Consistency Test",
        sequence: "0007",
        date: "2025-01-15",
      };

      const defaultResult = generateEightDTemplate(data);
      const simpleResult = generateSimpleTemplate(data);

      // Both should have the same header format
      expect(defaultResult).toContain("# 0007: Consistency Test");
      expect(simpleResult).toContain("# 0007: Consistency Test");

      expect(defaultResult).toContain("**Date:** 2025-01-15");
      expect(simpleResult).toContain("**Date:** 2025-01-15");

      expect(defaultResult).toContain("**Status:** Draft");
      expect(simpleResult).toContain("**Status:** Draft");
    });

    test("both templates should handle special characters in titles", () => {
      const data = {
        title: 'Problem with "Quotes" & Special Characters!',
        sequence: "0008",
        date: "2025-01-15",
      };

      const defaultResult = generateEightDTemplate(data);
      const simpleResult = generateSimpleTemplate(data);

      expect(defaultResult).toContain(
        '# 0008: Problem with "Quotes" & Special Characters!'
      );
      expect(simpleResult).toContain(
        '# 0008: Problem with "Quotes" & Special Characters!'
      );
    });
  });

  // Cleanup after all tests
  test("cleanup test environment", async () => {
    process.chdir(originalCwd);
    if (tempDir) {
      await fs.remove(tempDir);
    }
  });
});
