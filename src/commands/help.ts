import chalk from 'chalk';

export function helpCommand(): void {
  console.log(chalk.blue.bold('\n8D Tools - Eight Disciplines Problem-Solving CLI\n'));
  
  console.log(chalk.yellow('USAGE:'));
  console.log('  8d <command> [options]\n');
  
  console.log(chalk.yellow('COMMANDS:'));
  console.log('  help                     Show this help information');
  console.log('  init [directory]         Initialize 8D directory structure');
  console.log('  new <title> [options]    Create a new 8D report');
  console.log('  link <source> <target>   Link two existing 8D reports\n');
  
  console.log(chalk.yellow('EXAMPLES:'));
  console.log('  8d help                                    # Show help');
  console.log('  8d init                                    # Initialize in docs/8d');
  console.log('  8d init reports/8d                         # Initialize in custom directory');
  console.log('  8d new "Product quality issue"             # Create new 8D report');
  console.log('  8d new "Updated process" -s 3              # Create report superseding #3');
  console.log('  8d new "Related issue" -l "2:Related to:Related to"  # Create linked report');
  console.log('  8d link 1 2 "Supersedes"                   # Link report 1 to report 2\n');
  
  console.log(chalk.yellow('OPTIONS for new command:'));
  console.log('  -s, --supersede <number>     Supersede an existing 8D report');
  console.log('  -l, --link <link>           Link format: "number:LinkType:ReverseLink"\n');
  
  console.log(chalk.green('For more information, visit: https://github.com/zanozbot/8d-tools'));
}
