import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export interface EightDConfig {
  directory: string;
  sequenceFile: string;
  tocFile: string;
}

export async function getEightDConfig(): Promise<EightDConfig> {
  const rootDir = process.cwd();
  const adrDirFile = path.join(rootDir, '.8d-dir');

  if (!await fs.pathExists(adrDirFile)) {
    console.error(chalk.red('Error: 8D directory not initialized.'));
    console.error(chalk.yellow('Run "8d init" to initialize the 8D directory structure.'));
    process.exit(1);
  }

  const directory = (await fs.readFile(adrDirFile, 'utf8')).trim();
  const absoluteDir = path.resolve(directory);
  const sequenceFile = path.join(absoluteDir, '.8d-sequence.lock');
  const tocFile = path.join(absoluteDir, 'README.md');

  return {
    directory: absoluteDir,
    sequenceFile,
    tocFile
  };
}

export async function getNextSequenceNumber(): Promise<number> {
  const config = await getEightDConfig();
  
  if (!await fs.pathExists(config.sequenceFile)) {
    console.error(chalk.red('Error: Sequence file not found.'));
    console.error(chalk.yellow('Run "8d init" to initialize the 8D directory structure.'));
    process.exit(1);
  }

  const currentSequence = parseInt(await fs.readFile(config.sequenceFile, 'utf8'), 10);
  const nextSequence = currentSequence + 1;
  
  await fs.writeFile(config.sequenceFile, nextSequence.toString());
  
  return nextSequence;
}

export function formatSequenceNumber(num: number): string {
  return num.toString().padStart(4, '0');
}

export function generateFileName(sequence: number, title: string): string {
  const formattedSequence = formatSequenceNumber(sequence);
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${formattedSequence}-${slug}.md`;
}

export async function updateTableOfContents(reportPath: string, title: string, sequence: number): Promise<void> {
  const config = await getEightDConfig();
  
  if (!await fs.pathExists(config.tocFile)) {
    return;
  }

  const tocContent = await fs.readFile(config.tocFile, 'utf8');
  const fileName = path.basename(reportPath);
  const formattedSequence = formatSequenceNumber(sequence);
  const newEntry = `- [${formattedSequence}: ${title}](./${fileName})`;

  // Find the "## Reports" section and add the new entry
  const lines = tocContent.split('\n');
  const reportsIndex = lines.findIndex(line => line.trim() === '## Reports');
  
  if (reportsIndex === -1) {
    return;
  }

  // Find where to insert the new entry (after "## Reports" but before next section or end)
  let insertIndex = reportsIndex + 1;
  
  // Skip the "No reports" message if it exists
  if (lines[insertIndex + 1] && lines[insertIndex + 1].includes('No reports have been created yet')) {
    lines.splice(insertIndex + 1, 2); // Remove the "No reports" line and empty line
  }

  // Insert the new entry
  lines.splice(insertIndex + 1, 0, '', newEntry);

  await fs.writeFile(config.tocFile, lines.join('\n'));
}
