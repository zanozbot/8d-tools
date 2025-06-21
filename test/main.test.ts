import { test, describe } from "node:test";
import { ok, strictEqual } from "node:assert";
import fs from "fs-extra";
import { join } from "path";
import { tmpdir } from "os";
import { generateEightDTemplate } from "../dist/templates/default.js";
import { generateSimpleTemplate } from "../dist/templates/simple.js";
import {
  formatSequenceNumber,
  generateFileName,
} from "../dist/utils/fileUtils.js";
import { generateReportFromTemplate } from "../dist/utils/templateUtils.js";
import { getReverseLink } from "../dist/utils/linkUtils.js";

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

      ok(result.includes("# 0001: Test Problem"));
      ok(result.includes("**Date:** 2025-01-01"));
      ok(result.includes("## D0: Plan and prepare"));
      ok(result.includes("## D1: Form a team"));
      ok(result.includes("## D8: Celebrate with your team"));
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

      ok(result.includes("## Links"));
      ok(
        result.includes(
          "- Supersedes: [0001: Previous Problem](./0001-previous-problem.md)"
        )
      );
    });

    test("should generate a valid simple template", () => {
      const templateData = {
        title: "Simple Test Problem",
        sequence: "0003",
        date: "2025-01-01",
      };

      const result = generateSimpleTemplate(templateData);

      ok(result.includes("# 0003: Simple Test Problem"));
      ok(result.includes("**Date:** 2025-01-01"));
      ok(result.includes("## D0: Planning"));
      ok(result.includes("## D2: Problem statement & description"));
      ok(result.includes("## D4: Root cause & escape points"));
      ok(result.includes("## D5: Permanent corrective action"));
      ok(result.includes("## D7: Preventive measures"));
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

      ok(result.includes("## Links"));
      ok(
        result.includes(
          "- Related to: [0003: Previous Simple Problem](./0003-previous-simple-problem.md)"
        )
      );
    });
  });

  describe("Template Utilities (Unit Tests)", () => {
    // These tests need 8D initialization for custom template support
    test("initialize 8D for template utilities", async () => {
      const { initCommand } = await import("../dist/commands/init.js");
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

      ok(result.includes("# 0001: Test Report"));
      ok(result.includes("**Date:** 2025-01-01"));
      ok(result.includes("## D0: Plan and prepare"));
      ok(result.includes("## Links"));
      ok(
        result.includes(
          "- Related to: [0002: Other Report](./0002-other-report.md)"
        )
      );
    });

    test("should generate report from simple template directly", async () => {
      const data = {
        title: "Simple Test",
        sequence: "0002",
        date: "2025-01-01",
      };

      const result = await generateReportFromTemplate("simple", data);

      ok(result.includes("# 0002: Simple Test"));
      ok(result.includes("**Date:** 2025-01-01"));
      ok(result.includes("## D0: Planning"));
      ok(result.includes("## D2: Problem statement & description"));
      ok(result.includes("## D4: Root cause & escape points"));
      ok(result.includes("## D5: Permanent corrective action"));
      ok(result.includes("## D7: Preventive measures"));
    });

    // Note: Testing nonexistent templates requires 8D directory setup
    // This is covered in integration tests
  });

  describe("Link Utilities", () => {
    test("should return correct reverse links", () => {
      strictEqual(getReverseLink("Supersedes"), "Superseded by");
      strictEqual(getReverseLink("Superseded by"), "Supersedes");
      strictEqual(getReverseLink("Related to"), "Related to");
      strictEqual(getReverseLink("Amends"), "Amended by");
      strictEqual(getReverseLink("Amended by"), "Amends");
      strictEqual(getReverseLink("Clarifies"), "Clarified by");
      strictEqual(getReverseLink("Clarified by"), "Clarifies");
      strictEqual(getReverseLink("Extends"), "Extended by");
      strictEqual(getReverseLink("Extended by"), "Extends");
    });

    test("should return default reverse link for unknown types", () => {
      strictEqual(getReverseLink("Unknown Type"), "Related to");
      strictEqual(getReverseLink("Custom Link"), "Related to");
    });
  });

  describe("Utility Functions", () => {
    test("should format sequence numbers correctly", () => {
      strictEqual(formatSequenceNumber(1), "0001");
      strictEqual(formatSequenceNumber(42), "0042");
      strictEqual(formatSequenceNumber(999), "0999");
      strictEqual(formatSequenceNumber(1000), "1000");
    });

    test("should generate valid filenames", () => {
      strictEqual(
        generateFileName(1, "Product Quality Issue"),
        "0001-product-quality-issue.md"
      );

      strictEqual(
        generateFileName(42, "Complex Problem with Special Characters!@#"),
        "0042-complex-problem-with-special-characters.md"
      );

      strictEqual(
        generateFileName(5, "Multiple   Spaces   and---Dashes"),
        "0005-multiple-spaces-and-dashes.md"
      );
    });
  });

  describe("File Operations", () => {
    let tempDir: string;

    test("should create temporary directory for testing", async () => {
      tempDir = await fs.mkdtemp(join(tmpdir(), "8d-test-"));
      ok(await fs.pathExists(tempDir));
    });

    test("should clean up temporary directory", async () => {
      if (tempDir) {
        await fs.remove(tempDir);
        ok(!(await fs.pathExists(tempDir)));
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
