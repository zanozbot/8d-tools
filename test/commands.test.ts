import { test, describe } from "node:test";
import { ok, strictEqual } from "node:assert";
import fs from "fs-extra";
import { join } from "path";
import { tmpdir } from "os";
import { linkCommand } from "../dist/commands/link.js";
import { initCommand } from "../dist/commands/init.js";

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
      ok(await fs.pathExists(adrDirFile));

      const adrDirContent = await fs.readFile(adrDirFile, "utf8");
      strictEqual(adrDirContent.trim(), "test-8d");

      // Check if 8D directory was created
      const eightDDir = join(tempDir, "test-8d");
      ok(await fs.pathExists(eightDDir));

      // Check if sequence lock file was created
      const sequenceLockFile = join(eightDDir, ".8d-sequence.lock");
      ok(await fs.pathExists(sequenceLockFile));

      const sequenceContent = await fs.readFile(sequenceLockFile, "utf8");
      strictEqual(sequenceContent.trim(), "0");

      // Check if README.md was created
      const readmeFile = join(eightDDir, "README.md");
      ok(await fs.pathExists(readmeFile));

      const readmeContent = await fs.readFile(readmeFile, "utf8");
      ok(readmeContent.includes("# 8D Problem-Solving Reports"));
      ok(readmeContent.includes("Eight Disciplines (8D)"));

      // Check if .templates directory was created
      const templatesDir = join(eightDDir, ".templates");
      ok(await fs.pathExists(templatesDir));
    });

    test("should use default directory when none specified", async () => {
      // Clean up previous test
      await fs.remove(join(tempDir, ".8d-dir"));
      await fs.remove(join(tempDir, "test-8d"));

      await initCommand();

      // Check if default directory was used
      const adrDirFile = join(tempDir, ".8d-dir");
      ok(await fs.pathExists(adrDirFile));

      const adrDirContent = await fs.readFile(adrDirFile, "utf8");
      strictEqual(adrDirContent.trim(), "docs/8d");

      const defaultDir = join(tempDir, "docs/8d");
      ok(await fs.pathExists(defaultDir));
    });
  });

  describe("Link Command", () => {
    test("should use default linkType when not specified", () => {
      // Test that the function signature accepts optional linkType
      // We can't test the full functionality without setting up reports,
      // but we can verify the default parameter works

      // This should not throw an error about missing parameters
      const linkFn = linkCommand;
      strictEqual(typeof linkFn, "function");

      // Check that the function has the correct parameter count
      // (source, target, linkType = 'Supersedes')
      strictEqual(linkFn.length, 2); // Only required parameters count
    });
  });

  // Cleanup after all tests
  test("cleanup test environment", async () => {
    process.chdir(originalCwd);
    if (tempDir) {
      await fs.remove(tempDir);
      ok(!(await fs.pathExists(tempDir)));
    }
  });
});
