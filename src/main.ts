#!/usr/bin/env node

import { Command } from 'commander';
import { helpCommand } from './commands/help';
import { initCommand } from './commands/init';
import { newCommand } from './commands/new';
import { linkCommand } from './commands/link';
import { templateCommand } from './commands/template';

const program = new Command();

program
  .name('8d')
  .description('CLI tool for generating Eight Disciplines (8D) problem-solving documents')
  .version('1.0.0');

// Help command
program
  .command('help')
  .description('Show help information')
  .action(helpCommand);

// Init command
program
  .command('init')
  .argument('[directory]', 'Directory name for 8D reports', 'docs/8d')
  .description('Initialize 8D directory structure')
  .action(initCommand);

// New command
program
  .command('new')
  .argument('<title>', 'Title of the 8D report')
  .option('-s, --supersede <number>', 'Supersede an existing 8D report by number')
  .option('-l, --link <link>', 'Link to existing 8D report (format: "number:LinkType:ReverseLink")')
  .option('-t, --template <name>', 'Template to use (default: "default")')
  .description('Create a new 8D report')
  .action(newCommand);

// Link command
program
  .command('link')
  .argument('<source>', 'Source 8D report number')
  .argument('<target>', 'Target 8D report number')
  .argument('[linkType]', 'Type of link (default: "Supersedes")')
  .description('Link two existing 8D reports')
  .action(linkCommand);

// Template command
program
  .command('template')
  .argument('[action]', 'Action to perform (list, create, show, delete)')
  .argument('[name]', 'Template name')
  .option('--title <title>', 'Custom title for template creation')
  .description('Manage 8D report templates')
  .action(templateCommand);

// Default help when no command is provided
program.action(() => {
  helpCommand();
});

// Parse command line arguments
program.parse();