import fs from "fs-extra";
import { basename, join, resolve } from "path";
import chalk from "chalk";

export interface EightDConfig {
  directory: string;
  sequenceFile: string;
  tocFile: string;
}

export async function getEightDConfig(): Promise<EightDConfig> {
  const rootDir = process.cwd();
  const adrDirFile = join(rootDir, ".8d-dir");

  if (!(await fs.pathExists(adrDirFile))) {
    console.error(chalk.red("Error: 8D directory not initialized."));
    console.error(
      chalk.yellow('Run "8d init" to initialize the 8D directory structure.')
    );
    process.exit(1);
  }

  const directory = (await fs.readFile(adrDirFile, "utf8")).trim();
  const absoluteDir = resolve(directory);
  const sequenceFile = join(absoluteDir, ".8d-sequence.lock");
  const tocFile = join(absoluteDir, "README.md");

  return {
    directory: absoluteDir,
    sequenceFile,
    tocFile,
  };
}

export async function getCurrentSequenceNumber(): Promise<number> {
  const config = await getEightDConfig();

  if (!(await fs.pathExists(config.sequenceFile))) {
    console.error(chalk.red("Error: Sequence file not found."));
    console.error(
      chalk.yellow('Run "8d init" to initialize the 8D directory structure.')
    );
    process.exit(1);
  }

  const currentSequence = parseInt(
    await fs.readFile(config.sequenceFile, "utf8"),
    10
  );

  return currentSequence;
}

export async function incrementSequenceNumber(): Promise<number> {
  const config = await getEightDConfig();
  const currentSequence = await getCurrentSequenceNumber();
  const nextSequence = currentSequence + 1;

  await fs.writeFile(config.sequenceFile, nextSequence.toString());

  return nextSequence;
}

export async function getNextSequenceNumber(): Promise<number> {
  const currentSequence = await getCurrentSequenceNumber();
  return currentSequence + 1;
}

export function formatSequenceNumber(num: number): string {
  return num.toString();
}

export function generateFileName(sequence: number, title: string): string {
  const formattedSequence = formatSequenceNumber(sequence);
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${formattedSequence}-${slug}.md`;
}

export async function updateTableOfContents(
  reportPath: string,
  title: string,
  sequence: number
): Promise<void> {
  const config = await getEightDConfig();

  if (!(await fs.pathExists(config.tocFile))) {
    return;
  }

  const tocContent = await fs.readFile(config.tocFile, "utf8");
  const fileName = basename(reportPath);
  const formattedSequence = formatSequenceNumber(sequence);

  const lines = tocContent.split("\n");
  const reportsIndex = lines.findIndex((line) => line.trim() === "## Reports");

  if (reportsIndex === -1) {
    return;
  }

  // Find the next section after Reports
  let nextSectionIndex = lines.length;
  for (let i = reportsIndex + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ") && lines[i].trim() !== "## Reports") {
      nextSectionIndex = i;
      break;
    }
  }

  // Extract everything before Reports section, after Reports section
  const beforeReports = lines.slice(0, reportsIndex + 1);
  const afterReports = lines.slice(nextSectionIndex);

  // Collect existing report entries (skip "No reports" message)
  const reportEntries: Array<{ line: string; sequence: number }> = [];

  for (let i = reportsIndex + 1; i < nextSectionIndex; i++) {
    const line = lines[i];
    // Skip "No reports" message and empty lines
    if (
      line.includes("No reports have been created yet") ||
      line.trim() === ""
    ) {
      continue;
    }
    if (line.startsWith("- [")) {
      const match = line.match(/^\- \[(\d+):/);
      if (match) {
        reportEntries.push({
          line: line,
          sequence: parseInt(match[1], 10),
        });
      }
    }
  }

  // Add the new entry
  reportEntries.push({
    line: `- [${formattedSequence}: ${title}](./${fileName})`,
    sequence: sequence,
  });

  // Sort by sequence number (chronological order)
  reportEntries.sort((a, b) => a.sequence - b.sequence);

  // Rebuild the file
  const newLines = [
    ...beforeReports,
    "", // Empty line after "## Reports"
    ...reportEntries.map((entry) => entry.line),
    "", // Empty line before next section
    ...afterReports,
  ];

  await fs.writeFile(config.tocFile, newLines.join("\n"));
}
