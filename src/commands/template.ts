import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import {
  getAvailableTemplates,
  templateExists,
  getTemplateInfo,
  validateTemplateName,
  ensureTemplatesDirectory
} from '../utils/templateUtils';

interface TemplateCommandOptions {
  title?: string;
}

export async function templateCommand(action?: string, templateName?: string, options: TemplateCommandOptions = {}): Promise<void> {
  try {
    switch (action) {
      case 'list':
        await listTemplates();
        break;
      case 'create':
        if (!templateName) {
          console.error(chalk.red('Error: Template name is required for create action.'));
          console.log(chalk.yellow('Usage: 8d template create <name> [--title "Custom Title"]'));
          process.exit(1);
        }
        await createTemplate(templateName, options.title);
        break;
      case 'show':
        if (!templateName) {
          console.error(chalk.red('Error: Template name is required for show action.'));
          console.log(chalk.yellow('Usage: 8d template show <name>'));
          process.exit(1);
        }
        await showTemplate(templateName);
        break;
      case 'delete':
        if (!templateName) {
          console.error(chalk.red('Error: Template name is required for delete action.'));
          console.log(chalk.yellow('Usage: 8d template delete <name>'));
          process.exit(1);
        }
        await deleteTemplate(templateName);
        break;
      default:
        showTemplateHelp();
        break;
    }
  } catch (error) {
    console.error(chalk.red('Error managing templates:'), error);
    process.exit(1);
  }
}

async function listTemplates(): Promise<void> {
  console.log(chalk.blue.bold('\nAvailable Templates:\n'));

  const templates = await getAvailableTemplates();

  for (const templateName of templates) {
    try {
      const info = await getTemplateInfo(templateName);
      const builtInLabel = info.isBuiltIn ? chalk.gray(' (built-in)') : '';
      console.log(chalk.green(`• ${info.name}`) + builtInLabel + chalk.gray(` - ${info.title}`));
    } catch (error) {
      console.log(chalk.green(`• ${templateName}`) + chalk.red(' (error reading template)'));
    }
  }

  if (templates.length === 1) {
    console.log(chalk.yellow('\nNo custom templates found. Use "8d template create <name>" to create one.'));
  }

  console.log();
}

async function createTemplate(templateName: string, customTitle?: string): Promise<void> {
  // Validate template name
  if (!validateTemplateName(templateName)) {
    console.error(chalk.red('Error: Template name must contain only letters, numbers, hyphens, and underscores.'));
    console.error(chalk.red('Template name must be 1-50 characters long.'));
    process.exit(1);
  }

  // Check if template already exists
  if (await templateExists(templateName)) {
    console.error(chalk.red(`Error: Template "${templateName}" already exists.`));
    process.exit(1);
  }

  const templatesDir = await ensureTemplatesDirectory();
  const templatePath = path.join(templatesDir, `${templateName}.md`);

  const title = customTitle || `{{title}}`;
  const templateContent = generateCustomTemplate(title);

  await fs.writeFile(templatePath, templateContent);

  console.log(chalk.green(`✅ Template "${templateName}" created successfully!`));
  console.log(chalk.blue(`Location: ${path.relative(process.cwd(), templatePath)}`));

  if (!customTitle) {
    console.log(chalk.yellow('\nNote: This template uses {{title}} placeholder. You can edit the file to customize it further.'));
  }
}

async function showTemplate(templateName: string): Promise<void> {
  if (!(await templateExists(templateName))) {
    console.error(chalk.red(`Error: Template "${templateName}" not found.`));
    process.exit(1);
  }

  try {
    const info = await getTemplateInfo(templateName);

    if (info.isBuiltIn) {
      console.log(chalk.blue.bold('\nDefault Template (built-in):\n'));
      console.log(chalk.gray('This is the standard 8D problem-solving template with all disciplines.'));
      console.log(chalk.gray('It includes: D0-D8 sections, team formation, root cause analysis, etc.'));
      console.log(chalk.yellow('\nTo see the full template, create a new report: 8d new "Test Report"\n'));
      return;
    }

    if (info.path) {
      const content = await fs.readFile(info.path, 'utf8');
      console.log(chalk.blue.bold(`\nTemplate: ${templateName}\n`));
      console.log(content);
    }
  } catch (error) {
    console.error(chalk.red(`Error reading template "${templateName}":`, error));
    process.exit(1);
  }
}

async function deleteTemplate(templateName: string): Promise<void> {
  if (templateName === 'default') {
    console.error(chalk.red('Error: Cannot delete the built-in default template.'));
    process.exit(1);
  }

  if (!(await templateExists(templateName))) {
    console.error(chalk.red(`Error: Template "${templateName}" not found.`));
    process.exit(1);
  }

  try {
    const info = await getTemplateInfo(templateName);
    if (info.path) {
      await fs.remove(info.path);
      console.log(chalk.green(`✅ Template "${templateName}" deleted successfully.`));
    }
  } catch (error) {
    console.error(chalk.red(`Error deleting template "${templateName}":`, error));
    process.exit(1);
  }
}

function showTemplateHelp(): void {
  console.log(chalk.blue.bold('\n8D Template Management\n'));
  
  console.log(chalk.yellow('USAGE:'));
  console.log('  8d template <action> [options]\n');
  
  console.log(chalk.yellow('ACTIONS:'));
  console.log('  list                     List all available templates');
  console.log('  create <name>           Create a new custom template');
  console.log('  show <name>             Display template content');
  console.log('  delete <name>           Delete a custom template\n');
  
  console.log(chalk.yellow('OPTIONS for create:'));
  console.log('  --title <title>         Set a custom title (default: uses {{title}} placeholder)\n');
  
  console.log(chalk.yellow('EXAMPLES:'));
  console.log('  8d template list                              # List all templates');
  console.log('  8d template create simple                     # Create template with {{title}} placeholder');
  console.log('  8d template create incident --title "Security Incident Report"  # Create with fixed title');
  console.log('  8d template show simple                       # Display template content');
  console.log('  8d template delete simple                     # Delete custom template\n');
}

function generateCustomTemplate(title: string): string {
  return `# ${title}

**Date:** {{date}}  
**Status:** Draft
{{links}}

---

*This 8D report was generated using [8d-tools](https://github.com/zanozbot/8d-tools)*
`;
}
