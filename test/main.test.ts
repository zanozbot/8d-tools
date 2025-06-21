import { test, describe, expect } from "vitest";
import fs from "fs-extra";
import { join } from "path";
import { tmpdir } from "os";
import { generateEightDTemplate } from "../src/templates/default";
import { generateSimpleTemplate } from "../src/templates/simple";
import { formatSequenceNumber, generateFileName } from "../src/utils/fileUtils";
import { generateReportFromTemplate } from "../src/utils/templateUtils";
import { getReverseLink } from "../src/utils/linkUtils";

describe("8D Tools Tests", () => {
  let tempDir: string;
  let originalCwd: string;

  // Setup before all tests
  test("setup test environment", async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), "8d-main-test-"));
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  describe("Template Generation", () => {
    test("should generate a valid 8D template", () => {
      const templateData = {
        title: "Test Problem",
        sequence: "0001",
        date: "2025-01-01",
      };

      const result = generateEightDTemplate(templateData);

      expect(result).toContain("# 0001: Test Problem");
      expect(result).toContain("**Date:** 2025-01-01");
      expect(result).toContain("## D0: Plan and prepare");
      expect(result).toContain("## D1: Form a team");
      expect(result).toContain("## D8: Celebrate with your team");
    });

    test("should include links when provided", () => {
      const templateData = {
        title: "Test Problem",
        sequence: "0002",
        date: "2025-01-01",
        links: [
          "- Supersedes: [0001: Previous Problem](./0001-previous-problem.md)",
        ],
      };

      const result = generateEightDTemplate(templateData);

      expect(result).toContain("## Links");
      expect(result).toContain(
        "- Supersedes: [0001: Previous Problem](./0001-previous-problem.md)"
      );
    });

    test("should generate a valid simple template", () => {
      const templateData = {
        title: "Simple Test Problem",
        sequence: "0003",
        date: "2025-01-01",
      };

      const result = generateSimpleTemplate(templateData);

      expect(result).toContain("# 0003: Simple Test Problem");
      expect(result).toContain("**Date:** 2025-01-01");
      expect(result).toContain("## D0: Planning");
      expect(result).toContain("## D2: Problem statement & description");
      expect(result).toContain("## D4: Root cause & escape points");
      expect(result).toContain("## D5: Permanent corrective action");
      expect(result).toContain("## D7: Preventive measures");
    });

    test("should include links in simple template when provided", () => {
      const templateData = {
        title: "Simple Test Problem",
        sequence: "0004",
        date: "2025-01-01",
        links: [
          "- Related to: [0003: Previous Simple Problem](./0003-previous-simple-problem.md)",
        ],
      };

      const result = generateSimpleTemplate(templateData);

      expect(result).toContain("## Links");
      expect(result).toContain(
        "- Related to: [0003: Previous Simple Problem](./0003-previous-simple-problem.md)"
      );
    });
  });

  describe("Template Utilities (Unit Tests)", () => {
    // These tests need 8D initialization for custom template support
    test("initialize 8D for template utilities", async () => {
      const { initCommand } = await import("../src/commands/init");
      await initCommand("test-8d");
    });

    test("should generate report from default template directly", async () => {
      const data = {
        title: "Test Report",
        sequence: "0001",
        date: "2025-01-01",
        links: ["- Related to: [0002: Other Report](./0002-other-report.md)"],
      };

      const result = await generateReportFromTemplate("default", data);

      expect(result).toContain("# 0001: Test Report");
      expect(result).toContain("**Date:** 2025-01-01");
      expect(result).toContain("## D0: Plan and prepare");
      expect(result).toContain("## Links");
      expect(result).toContain(
        "- Related to: [0002: Other Report](./0002-other-report.md)"
      );
    });

    test("should generate report from simple template directly", async () => {
      const data = {
        title: "Simple Test",
        sequence: "0002",
        date: "2025-01-01",
      };

      const result = await generateReportFromTemplate("simple", data);

      expect(result).toContain("# 0002: Simple Test");
      expect(result).toContain("**Date:** 2025-01-01");
      expect(result).toContain("## D0: Planning");
      expect(result).toContain("## D2: Problem statement & description");
      expect(result).toContain("## D4: Root cause & escape points");
      expect(result).toContain("## D5: Permanent corrective action");
      expect(result).toContain("## D7: Preventive measures");
    });

    // Note: Testing nonexistent templates requires 8D directory setup
    // This is covered in integration tests
  });

  describe("Link Utilities", () => {
    test("should return correct reverse links", () => {
      expect(getReverseLink("Supersedes")).toBe("Superseded by");
      expect(getReverseLink("Superseded by")).toBe("Supersedes");
      expect(getReverseLink("Related to")).toBe("Related to");
      expect(getReverseLink("Amends")).toBe("Amended by");
      expect(getReverseLink("Amended by")).toBe("Amends");
      expect(getReverseLink("Clarifies")).toBe("Clarified by");
      expect(getReverseLink("Clarified by")).toBe("Clarifies");
      expect(getReverseLink("Extends")).toBe("Extended by");
      expect(getReverseLink("Extended by")).toBe("Extends");
    });

    test("should return default reverse link for unknown types", () => {
      expect(getReverseLink("Unknown Type")).toBe("Related to");
      expect(getReverseLink("Custom Link")).toBe("Related to");
    });
  });

  describe("Utility Functions", () => {
    test("should format sequence numbers correctly", () => {
      expect(formatSequenceNumber(1)).toBe("0001");
      expect(formatSequenceNumber(42)).toBe("0042");
      expect(formatSequenceNumber(999)).toBe("0999");
      expect(formatSequenceNumber(1000)).toBe("1000");
    });

    test("should generate valid filenames", () => {
      expect(generateFileName(1, "Product Quality Issue")).toBe(
        "0001-product-quality-issue.md"
      );

      expect(
        generateFileName(42, "Complex Problem with Special Characters!@#")
      ).toBe("0042-complex-problem-with-special-characters.md");

      expect(generateFileName(5, "Multiple   Spaces   and---Dashes")).toBe(
        "0005-multiple-spaces-and-dashes.md"
      );
    });
  });

  describe("File Operations", () => {
    let tempDir: string;

    test("should create temporary directory for testing", async () => {
      tempDir = await fs.mkdtemp(join(tmpdir(), "8d-test-"));
      expect(await fs.pathExists(tempDir)).toBe(true);
    });

    test("should clean up temporary directory", async () => {
      if (tempDir) {
        await fs.remove(tempDir);
        expect(await fs.pathExists(tempDir)).toBe(false);
      }
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
