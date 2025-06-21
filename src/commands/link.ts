import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { getEightDConfig, formatSequenceNumber } from '../utils/fileUtils';

export async function linkCommand(source: string, target: string, linkType: string): Promise<void> {
  try {
    const config = await getEightDConfig();
    
    const sourceNum = parseInt(source, 10);
    const targetNum = parseInt(target, 10);
    
    if (isNaN(sourceNum) || isNaN(targetNum)) {
      console.error(chalk.red('Error: Source and target must be valid numbers.'));
      process.exit(1);
    }

    if (sourceNum === targetNum) {
      console.error(chalk.red('Error: Source and target cannot be the same report.'));
      process.exit(1);
    }

    // Find the source and target files
    const sourceFile = await findReportByNumber(config.directory, sourceNum);
    const targetFile = await findReportByNumber(config.directory, targetNum);

    if (!sourceFile) {
      console.error(chalk.red(`Error: Source report ${formatSequenceNumber(sourceNum)} not found.`));
      process.exit(1);
    }

    if (!targetFile) {
      console.error(chalk.red(`Error: Target report ${formatSequenceNumber(targetNum)} not found.`));
      process.exit(1);
    }

    const sourceFilePath = path.join(config.directory, sourceFile);
    const targetFilePath = path.join(config.directory, targetFile);

    // Get titles
    const sourceTitle = await getReportTitle(sourceFilePath);
    const targetTitle = await getReportTitle(targetFilePath);

    // Add link from source to target
    const sourceLink = `${linkType}: [${formatSequenceNumber(targetNum)}: ${targetTitle}](./${targetFile})`;
    await addLinkToReport(sourceFilePath, sourceLink);

    // Add reverse link from target to source (determine reverse link type)
    const reverseLinkType = getReverseLink(linkType);
    const targetLink = `${reverseLinkType}: [${formatSequenceNumber(sourceNum)}: ${sourceTitle}](./${sourceFile})`;
    await addLinkToReport(targetFilePath, targetLink);

    console.log(chalk.green(`✅ Successfully linked reports:`));
    console.log(chalk.blue(`   ${formatSequenceNumber(sourceNum)} ${linkType.toLowerCase()} ${formatSequenceNumber(targetNum)}`));
    console.log(chalk.blue(`   ${formatSequenceNumber(targetNum)} ${reverseLinkType.toLowerCase()} ${formatSequenceNumber(sourceNum)}`));

  } catch (error) {
    console.error(chalk.red('Error linking reports:'), error);
    process.exit(1);
  }
}

async function findReportByNumber(directory: string, number: number): Promise<string | null> {
  const formattedNumber = formatSequenceNumber(number);
  const files = await fs.readdir(directory);
  
  for (const file of files) {
    if (file.startsWith(formattedNumber + '-') && file.endsWith('.md')) {
      return file;
    }
  }
  
  return null;
}

async function getReportTitle(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  const titleLine = lines.find(line => line.startsWith('# '));
  
  if (titleLine) {
    // Extract title after the sequence number
    const match = titleLine.match(/^# \d+: (.+)$/);
    return match ? match[1] : titleLine.substring(2);
  }
  
  return 'Unknown Title';
}

async function addLinkToReport(filePath: string, linkText: string): Promise<void> {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Check if link already exists
  if (content.includes(linkText)) {
    return; // Link already exists
  }
  
  // Find the Links section or create it
  const linksIndex = lines.findIndex(line => line.trim() === '## Links');
  
  if (linksIndex !== -1) {
    // Links section exists, add the new link
    let insertIndex = linksIndex + 1;
    
    // Skip empty lines
    while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
      insertIndex++;
    }
    
    lines.splice(insertIndex, 0, `- ${linkText}`);
  } else {
    // Create Links section after the status line
    const statusIndex = lines.findIndex(line => line.includes('**Status:**'));
    if (statusIndex !== -1) {
      lines.splice(statusIndex + 1, 0, '', '## Links', '', `- ${linkText}`);
    }
  }
  
  await fs.writeFile(filePath, lines.join('\n'));
}

function getReverseLink(linkType: string): string {
  const reverseMappings: { [key: string]: string } = {
    'Supersedes': 'Superseded by',
    'Superseded by': 'Supersedes',
    'Related to': 'Related to',
    'Amends': 'Amended by',
    'Amended by': 'Amends',
    'Clarifies': 'Clarified by',
    'Clarified by': 'Clarifies',
    'Extends': 'Extended by',
    'Extended by': 'Extends'
  };

  return reverseMappings[linkType] || 'Related to';
}
