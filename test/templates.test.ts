import { test, describe } from "node:test";
import { ok, strictEqual } from "node:assert";
import fs from "fs-extra";
import { join } from "path";
import { tmpdir } from "os";
import {
  generateEightDTemplate,
  TemplateData,
} from "../dist/templates/default.js";
import {
  generateSimpleTemplate,
  SimpleTemplateData,
} from "../dist/templates/simple.js";

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
      ok(result.includes("# 0001: Manufacturing Defect"));
      ok(result.includes("**Date:** 2025-01-15"));
      ok(result.includes("**Status:** Draft"));

      // Check all 8D sections are present
      ok(result.includes("## D0: Plan and prepare"));
      ok(result.includes("## D1: Form a team"));
      ok(result.includes("## D2: Identify the problem"));
      ok(result.includes("## D3: Develop interim containment plan"));
      ok(result.includes("## D4: Verify root causes and escape points"));
      ok(result.includes("## D5: Choose permanent corrective actions"));
      ok(result.includes("## D6: Implement corrective actions"));
      ok(result.includes("## D7: Take preventive measures"));
      ok(result.includes("## D8: Celebrate with your team"));

      // Check specific subsections
      ok(result.includes("### Problem background"));
      ok(result.includes("### Team members"));
      ok(result.includes("### 5W2H analysis"));
      ok(result.includes("### Root cause analysis"));
      ok(result.includes("### Implementation plan"));
      ok(result.includes("### Team recognition"));

      // Check footer
      ok(result.includes("*This 8D report was generated using [8d-tools]"));
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

      ok(result.includes("## Links"));
      ok(
        result.includes(
          "- Supersedes: [0001: Original Quality Issue](./0001-original-quality-issue.md)"
        )
      );
      ok(
        result.includes(
          "- Related to: [0003: Process Improvement](./0003-process-improvement.md)"
        )
      );
    });

    test("should not include links section when no links provided", () => {
      const data: TemplateData = {
        title: "Standalone Issue",
        sequence: "0003",
        date: "2025-01-15",
      };

      const result = generateEightDTemplate(data);

      ok(!result.includes("## Links"));
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
      ok(result.includes("# 0004: Quick Fix Required"));
      ok(result.includes("**Date:** 2025-01-15"));
      ok(result.includes("**Status:** Draft"));

      // Check simple sections
      ok(result.includes("## D0: Planning"));
      ok(result.includes("## D1: Team members"));
      ok(result.includes("## D2: Problem statement & description"));
      ok(result.includes("## D4: Root cause & escape points"));
      ok(result.includes("## D7: Preventive measures"));

      // Check comments are present
      ok(
        result.includes(
          "<!-- Gather data, feedback, and prerequisites required to solve the problem. -->"
        )
      );
      ok(result.includes("<!-- List team members and their roles -->"));
      ok(
        result.includes("<!-- Describe the problem clearly and concisely -->")
      );
      ok(
        result.includes(
          "<!-- Identify all possible root causes and escape points for the problem. -->"
        )
      );
      ok(
        result.includes(
          "<!-- Describe any measure to implement to avoid similar problems in the future. -->"
        )
      );

      // Check footer
      ok(result.includes("*This 8D report was generated using [8d-tools]"));

      // Ensure it doesn't include detailed 8D subsections from default template
      ok(!result.includes("### Problem background"));
      ok(!result.includes("### 5W2H analysis"));
      ok(!result.includes("### Potential root causes"));
    });

    test("should include links section when links provided", () => {
      const data: SimpleTemplateData = {
        title: "Emergency Fix",
        sequence: "0005",
        date: "2025-01-15",
        links: ["- Amends: [0004: Original Fix](./0004-original-fix.md)"],
      };

      const result = generateSimpleTemplate(data);

      ok(result.includes("## Links"));
      ok(
        result.includes(
          "- Amends: [0004: Original Fix](./0004-original-fix.md)"
        )
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

      ok(!result.includes("## Links"));
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

      ok(defaultResult.length > simpleResult.length);
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
      ok(defaultResult.includes("# 0007: Consistency Test"));
      ok(simpleResult.includes("# 0007: Consistency Test"));

      ok(defaultResult.includes("**Date:** 2025-01-15"));
      ok(simpleResult.includes("**Date:** 2025-01-15"));

      ok(defaultResult.includes("**Status:** Draft"));
      ok(simpleResult.includes("**Status:** Draft"));
    });

    test("both templates should handle special characters in titles", () => {
      const data = {
        title: 'Problem with "Quotes" & Special Characters!',
        sequence: "0008",
        date: "2025-01-15",
      };

      const defaultResult = generateEightDTemplate(data);
      const simpleResult = generateSimpleTemplate(data);

      ok(
        defaultResult.includes(
          '# 0008: Problem with "Quotes" & Special Characters!'
        )
      );
      ok(
        simpleResult.includes(
          '# 0008: Problem with "Quotes" & Special Characters!'
        )
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
