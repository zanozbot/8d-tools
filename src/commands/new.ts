import fs from "fs-extra";
import { join, relative } from "path";
import chalk from "chalk";
import {
  getEightDConfig,
  getNextSequenceNumber,
  generateFileName,
  formatSequenceNumber,
  updateTableOfContents,
} from "../utils/fileUtils";
import {
  generateReportFromTemplate,
  templateExists,
  CustomTemplateData,
} from "../utils/templateUtils";
import { addLinkToReport, getReverseLink } from "../utils/linkUtils";

interface NewCommandOptions {
  supersede?: string;
  link?: string;
  template?: string;
}

export async function newCommand(
  title: string,
  options: NewCommandOptions = {}
): Promise<void> {
  try {
    const config = await getEightDConfig();
    const sequence = await getNextSequenceNumber();
    const fileName = generateFileName(sequence, title);
    const filePath = join(config.directory, fileName);
    const formattedSequence = formatSequenceNumber(sequence);

    // Check if file already exists
    if (await fs.pathExists(filePath)) {
      console.error(chalk.red(`Error: File ${fileName} already exists.`));
      process.exit(1);
    }

    // Validate template if specified
    const templateName = options.template || "default";
    if (!(await templateExists(templateName))) {
      console.error(chalk.red(`Error: Template "${templateName}" not found.`));
      console.log(
        chalk.yellow('Use "8d template list" to see available templates.')
      );
      process.exit(1);
    }

    // Prepare links array
    const links: string[] = [];

    // Handle supersede option
    if (options.supersede) {
      const supersedeNum = parseInt(options.supersede, 10);
      if (isNaN(supersedeNum)) {
        console.error(chalk.red("Error: Supersede option must be a number."));
        process.exit(1);
      }

      const supersedeFileName = await findReportByNumber(
        config.directory,
        supersedeNum
      );
      if (!supersedeFileName) {
        console.error(
          chalk.red(
            `Error: Report ${formatSequenceNumber(supersedeNum)} not found.`
          )
        );
        process.exit(1);
      }

      // Add supersede link
      links.push(
        `- Supersedes: [${formatSequenceNumber(
          supersedeNum
        )}: ${await getReportTitle(
          join(config.directory, supersedeFileName)
        )}](./${supersedeFileName})`
      );

      // Update the superseded report
      await addLinkToReport(
        join(config.directory, supersedeFileName),
        `Superseded by: [${formattedSequence}: ${title}](./${fileName})`
      );
      console.log(
        chalk.green(
          `Updated report ${formatSequenceNumber(
            supersedeNum
          )} with superseded link.`
        )
      );
    }

    // Handle link option
    if (options.link) {
      const linkParts = options.link.split(":");
      if (linkParts.length !== 3) {
        console.error(
          chalk.red(
            'Error: Link format should be "number:LinkType:ReverseLink"'
          )
        );
        console.error(chalk.yellow('Example: "2:Related to:Related to"'));
        process.exit(1);
      }

      const [linkNumStr, linkType, reverseLinkType] = linkParts;
      const linkNum = parseInt(linkNumStr, 10);
      const actualReverseLinkType = reverseLinkType || getReverseLink(linkType);

      if (isNaN(linkNum)) {
        console.error(chalk.red("Error: Link number must be a valid number."));
        process.exit(1);
      }

      const linkFileName = await findReportByNumber(config.directory, linkNum);
      if (!linkFileName) {
        console.error(
          chalk.red(`Error: Report ${formatSequenceNumber(linkNum)} not found.`)
        );
        process.exit(1);
      }

      // Add link to new report
      links.push(
        `- ${linkType}: [${formatSequenceNumber(
          linkNum
        )}: ${await getReportTitle(
          join(config.directory, linkFileName)
        )}](./${linkFileName})`
      );

      // Add reverse link to existing report
      await addLinkToReport(
        join(config.directory, linkFileName),
        `${actualReverseLinkType}: [${formattedSequence}: ${title}](./${fileName})`
      );
      console.log(
        chalk.green(
          `Added link between reports ${formatSequenceNumber(
            linkNum
          )} and ${formattedSequence}.`
        )
      );
    }

    // Generate the report content
    const templateData: CustomTemplateData = {
      title,
      sequence: formattedSequence,
      date: new Date().toISOString().split("T")[0],
      links: links.length > 0 ? links : undefined,
    };

    const content = await generateReportFromTemplate(
      templateName,
      templateData
    );

    // Write the file
    await fs.writeFile(filePath, content);
    console.log(chalk.green(`Created 8D report: ${fileName}`));

    // Update table of contents
    await updateTableOfContents(filePath, title, sequence);
    console.log(chalk.green("Updated table of contents."));

    console.log(
      chalk.blue.bold(
        `\n✅ 8D Report ${formattedSequence} created successfully!`
      )
    );
    console.log(chalk.blue(`File: ${relative(process.cwd(), filePath)}`));
  } catch (error) {
    console.error(chalk.red("Error creating 8D report:"), error);
    process.exit(1);
  }
}

async function findReportByNumber(
  directory: string,
  number: number
): Promise<string | null> {
  const formattedNumber = formatSequenceNumber(number);
  const files = await fs.readdir(directory);

  for (const file of files) {
    if (file.startsWith(formattedNumber + "-") && file.endsWith(".md")) {
      return file;
    }
  }

  return null;
}

async function getReportTitle(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split("\n");
  const titleLine = lines.find((line) => line.startsWith("# "));

  if (titleLine) {
    // Extract title after the sequence number
    const match = titleLine.match(/^# \d+: (.+)$/);
    return match ? match[1] : titleLine.substring(2);
  }

  return "Unknown Title";
}
