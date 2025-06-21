import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export async function initCommand(directory: string = 'docs/8d'): Promise<void> {
  try {
    const absoluteDir = path.resolve(directory);
    const rootDir = process.cwd();
    const adrDirFile = path.join(rootDir, '.8d-dir');
    const sequenceLockFile = path.join(absoluteDir, '.8d-sequence.lock');
    const tocFile = path.join(absoluteDir, 'README.md');

    // Check if already initialized
    if (await fs.pathExists(adrDirFile)) {
      console.log(chalk.yellow('8D directory already initialized.'));
      const existingDir = await fs.readFile(adrDirFile, 'utf8');
      console.log(chalk.blue(`Current 8D directory: ${existingDir.trim()}`));
      return;
    }

    // Create the 8D directory
    await fs.ensureDir(absoluteDir);
    console.log(chalk.green(`Created directory: ${directory}`));

    // Create .8d-dir file pointing to the 8D directory
    await fs.writeFile(adrDirFile, directory);
    console.log(chalk.green(`Created .8d-dir file pointing to: ${directory}`));

    // Create .8d-sequence.lock file with initial sequence number
    await fs.writeFile(sequenceLockFile, '0');
    console.log(chalk.green('Created .8d-sequence.lock file'));

    // Create initial table of contents
    const tocContent = `# 8D Problem-Solving Reports

This directory contains Eight Disciplines (8D) problem-solving reports.

## Reports

No reports have been created yet. Use \`8d new "Problem Title"\` to create your first report.

## About 8D

The Eight Disciplines (8D) is a problem-solving methodology designed to find the root cause of a problem, devise a short-term fix and implement a long-term solution to prevent recurring problems.

The eight disciplines are:
- **D0**: Plan and prepare
- **D1**: Form a team
- **D2**: Identify the problem
- **D3**: Develop interim containment plan
- **D4**: Verify root causes and escape points
- **D5**: Choose permanent corrective actions
- **D6**: Implement corrective actions
- **D7**: Take preventive measures
- **D8**: Celebrate with your team
`;

    await fs.writeFile(tocFile, tocContent);
    console.log(chalk.green('Created table of contents (README.md)'));

    // Create templates directory for custom templates
    const templatesDir = path.join(absoluteDir, '.templates');
    await fs.ensureDir(templatesDir);
    console.log(chalk.green('Created .templates directory'));

    console.log(chalk.blue.bold('\n✅ 8D directory structure initialized successfully!'));
    console.log(chalk.blue(`Directory: ${directory}`));
    console.log(chalk.yellow('\nNext steps:'));
    console.log(chalk.yellow('1. Create your first 8D report: 8d new "Problem Title"'));
    console.log(chalk.yellow('2. Try the simple template: 8d new "Quick Report" -t simple'));
    console.log(chalk.yellow('3. List available templates: 8d template list'));
    console.log(chalk.yellow('4. Use "8d help" for more commands\n'));

  } catch (error) {
    console.error(chalk.red('Error initializing 8D directory:'), error);
    process.exit(1);
  }
}
