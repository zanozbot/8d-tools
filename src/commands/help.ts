import chalk from "chalk";

export function helpCommand(): void {
  console.log(
    chalk.blue.bold("\n8D Tools - Eight Disciplines Problem-Solving CLI\n")
  );

  console.log(chalk.yellow("USAGE:"));
  console.log("  8d <command> [options]\n");

  console.log(chalk.yellow("COMMANDS:"));
  console.log("  help                        Show this help information");
  console.log(
    "  init [directory]            Initialize 8D directory structure"
  );
  console.log("  new <title> [options]       Create a new 8D report");
  console.log(
    "  link <source> <target> [linkType]  Link two existing 8D reports"
  );
  console.log("  template [action] [name]    Manage 8D report templates\n");

  console.log(chalk.yellow("EXAMPLES:"));
  console.log(
    "  8d help                                              # Show help"
  );
  console.log(
    "  8d init                                              # Initialize in docs/8d"
  );
  console.log(
    "  8d init reports/8d                                   # Initialize in custom directory"
  );
  console.log(
    '  8d new "Product quality issue"                       # Create new 8D report'
  );
  console.log(
    '  8d new "Updated process" -s 3                        # Create report superseding #3'
  );
  console.log(
    '  8d new "Related issue" -l "2:Related to:Related to"  # Create linked report'
  );
  console.log(
    '  8d new "Simple incident" -t simple                   # Create report using simple template'
  );
  console.log(
    "  8d link 1 2                                          # Link reports (default: Supersedes)"
  );
  console.log(
    '  8d link 1 2 "Related to"                             # Link with custom type'
  );
  console.log(
    "  8d template list                                     # List available templates"
  );
  console.log(
    "  8d template create incident                          # Create custom template\n"
  );

  console.log(chalk.yellow("OPTIONS for new command:"));
  console.log("  -s, --supersede <number>    Supersede an existing 8D report");
  console.log(
    '  -l, --link <link>           Link format: "number:LinkType:ReverseLink"'
  );
  console.log(
    '  -t, --template <name>       Template to use (default: "default")\n'
  );

  console.log(chalk.yellow("AVAILABLE TEMPLATES:"));
  console.log(
    "  • default    Comprehensive 8D template with all disciplines (D0-D8)"
  );
  console.log("  • simple     Streamlined template for quick problem-solving");
  console.log(
    '  • custom     Create your own templates with "8d template create"\n'
  );

  console.log(chalk.yellow("AVAILABLE LINK TYPES:"));
  console.log(
    "  The following link types are supported with automatic reverse linking:"
  );
  console.log(
    "  • Supersedes ↔ Superseded by   (when one report replaces another)"
  );
  console.log("  • Related to ↔ Related to      (for general relationships)");
  console.log(
    "  • Amends ↔ Amended by          (when one report modifies another)"
  );
  console.log(
    "  • Clarifies ↔ Clarified by     (when one report explains another)"
  );
  console.log(
    "  • Extends ↔ Extended by        (when one report builds upon another)\n"
  );

  console.log(chalk.yellow("LINK EXAMPLES:"));
  console.log(
    '  8d link 1 2                                          # Uses default "Supersedes"'
  );
  console.log(
    '  8d new "Follow-up" -l "1:Supersedes:Superseded by"  # New report supersedes #1'
  );
  console.log(
    '  8d new "Amendment" -l "2:Amends:Amended by"         # New report amends #2'
  );
  console.log(
    '  8d link 3 4 "Clarifies"                             # Report #3 clarifies #4'
  );
  console.log(
    '  8d link 5 6 "Related to"                            # Reports #5 and #6 are related\n'
  );

  console.log(
    chalk.green(
      "For more information, visit: https://github.com/zanozbot/8d-tools"
    )
  );
}
