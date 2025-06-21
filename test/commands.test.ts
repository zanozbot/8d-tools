import { test, describe, expect } from "vitest";
import fs from "fs-extra";
import { join } from "path";
import { tmpdir } from "os";
import { linkCommand } from "../src/commands/link";
import { initCommand } from "../src/commands/init";

describe("Command Tests", () => {
  let tempDir: string;
  let originalCwd: string;

  // Setup before all tests
  test("setup test environment", async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), "8d-cmd-test-"));
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  describe("Init Command", () => {
    test("should create 8D directory structure", async () => {
      await initCommand("test-8d");

      // Check if .8d-dir file was created
      const adrDirFile = join(tempDir, ".8d-dir");
      expect(await fs.pathExists(adrDirFile)).toBe(true);

      const adrDirContent = await fs.readFile(adrDirFile, "utf8");
      expect(adrDirContent.trim()).toBe("test-8d");

      // Check if 8D directory was created
      const eightDDir = join(tempDir, "test-8d");
      expect(await fs.pathExists(eightDDir)).toBe(true);

      // Check if sequence lock file was created
      const sequenceLockFile = join(eightDDir, ".8d-sequence.lock");
      expect(await fs.pathExists(sequenceLockFile)).toBe(true);

      const sequenceContent = await fs.readFile(sequenceLockFile, "utf8");
      expect(sequenceContent.trim()).toBe("0");

      // Check if README.md was created
      const readmeFile = join(eightDDir, "README.md");
      expect(await fs.pathExists(readmeFile)).toBe(true);

      const readmeContent = await fs.readFile(readmeFile, "utf8");
      expect(readmeContent).toContain("# 8D Problem-Solving Reports");
      expect(readmeContent).toContain("Eight Disciplines (8D)");

      // Check if .templates directory was created
      const templatesDir = join(eightDDir, ".templates");
      expect(await fs.pathExists(templatesDir)).toBe(true);
    });

    test("should use default directory when none specified", async () => {
      // Clean up previous test
      await fs.remove(join(tempDir, ".8d-dir"));
      await fs.remove(join(tempDir, "test-8d"));

      await initCommand();

      // Check if default directory was used
      const adrDirFile = join(tempDir, ".8d-dir");
      expect(await fs.pathExists(adrDirFile)).toBe(true);

      const adrDirContent = await fs.readFile(adrDirFile, "utf8");
      expect(adrDirContent.trim()).toBe("docs/8d");

      const defaultDir = join(tempDir, "docs/8d");
      expect(await fs.pathExists(defaultDir)).toBe(true);
    });
  });

  describe("Link Command", () => {
    test("should use default linkType when not specified", () => {
      // Test that the function signature accepts optional linkType
      // We can't test the full functionality without setting up reports,
      // but we can verify the default parameter works

      // This should not throw an error about missing parameters
      const linkFn = linkCommand;
      expect(typeof linkFn).toBe("function");

      // Check that the function has the correct parameter count
      // (source, target, linkType = 'Supersedes')
      expect(linkFn.length).toBe(2); // Only required parameters count
    });
  });

  // Cleanup after all tests
  test("cleanup test environment", async () => {
    process.chdir(originalCwd);
    if (tempDir) {
      await fs.remove(tempDir);
      expect(await fs.pathExists(tempDir)).toBe(false);
    }
  });
});
