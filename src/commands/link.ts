import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { getEightDConfig, formatSequenceNumber } from '../utils/fileUtils';
import { addLinkToReport, getReverseLink } from '../utils/linkUtils';

export async function linkCommand(source: string, target: string, linkType: string = 'Supersedes'): Promise<void> {
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


