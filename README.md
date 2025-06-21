# 8D Tools

A command-line tool for generating Eight Disciplines (8D) problem-solving reports from customizable templates, inspired by the ADR-tools pattern.

## What is 8D?

The Eight Disciplines (8D) is a problem-solving methodology designed to find the root cause of a problem, devise a short-term fix and implement a long-term solution to prevent recurring problems. Originally developed by Ford Motor Company, it's widely used in manufacturing and quality management.

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

## Installation

```bash
npm install -g @zanozbot/8d-tools
```

## Quick Start

1. **Initialize 8D directory structure:**
   ```bash
   8d init
   ```

2. **Create your first 8D report:**
   ```bash
   8d new "Product Quality Issue"
   ```

3. **View help for all commands:**
   ```bash
   8d help
   ```

For detailed usage instructions, see [docs/USAGE.md](docs/USAGE.md).

## Commands

### `8d help`
Shows comprehensive help information with examples.

### `8d init [directory]`
Initializes the 8D directory structure.

**Arguments:**
- `directory` (optional): Directory for 8D reports (default: `docs/8d`)

**Creates:**
- `.8d-dir` file pointing to the 8D directory
- 8D directory with `.8d-sequence.lock` file
- Table of contents (`README.md`)

**Examples:**
```bash
8d init                    # Initialize in docs/8d
8d init reports/8d         # Initialize in custom directory
```

### `8d new <title> [options]`
Creates a new 8D report with sequential numbering.

**Arguments:**
- `title`: Title of the 8D report

**Options:**
- `-s, --supersede <number>`: Supersede an existing 8D report
- `-l, --link <link>`: Link to existing report (format: "number:LinkType:ReverseLink")
- `-t, --template <name>`: Template to use (default: "default")

**Examples:**
```bash
8d new "Product Quality Issue"
8d new "Updated Process" -s 3
8d new "Related Issue" -l "2:Related to:Related to"
8d new "Simple incident" -t simple
```

### `8d link <source> <target> [linkType]`
Links two existing 8D reports.

**Arguments:**
- `source`: Source 8D report number
- `target`: Target 8D report number
- `linkType` (optional): Type of link (default: "Supersedes")

**Examples:**
```bash
8d link 1 2              # Uses default "Supersedes"
8d link 1 2 "Related to"
8d link 3 4 "Supersedes"
```

### `8d template [action] [name] [options]`
Manage 8D report templates.

**Actions:**
- `list`: List all available templates
- `create <name>`: Create a new custom template
- `show <name>`: Display template content
- `delete <name>`: Delete a custom template

**Options for create:**
- `--title <title>`: Set a custom title (default: uses {{title}} placeholder)

**Examples:**
```bash
8d template list                                    # List all templates
8d template create incident                         # Create template with {{title}} placeholder
8d template create security --title "Security Incident"  # Create with fixed title
8d template show simple                             # Display simple template
8d template delete incident                         # Delete custom template
```

## File Structure

After initialization, your project will have:

```
project-root/
├── .8d-dir                    # Points to 8D directory
└── docs/8d/                   # Default 8D directory
    ├── .8d-sequence.lock      # Tracks sequence numbers
    ├── .templates/            # Custom templates directory
    │   ├── incident.md        # Custom incident template
    │   └── security.md        # Custom security template
    ├── README.md              # Table of contents
    ├── 0001-first-issue.md    # First 8D report
    └── 0002-second-issue.md   # Second 8D report
```

## Templates

8D-tools supports multiple templates to suit different problem-solving needs:

### Built-in Templates

#### Default Template (`default`)
The comprehensive 8D template covering all eight disciplines:
- **Header**: Title, date, status, and links
- **D0**: Planning and preparation
- **D1**: Team formation
- **D2**: Problem identification with 5W2H analysis
- **D3**: Interim containment planning
- **D4**: Root cause analysis and escape points
- **D5**: Permanent corrective action selection
- **D6**: Implementation planning
- **D7**: Preventive measures
- **D8**: Team celebration and lessons learned

#### Simple Template (`simple`)
A streamlined template for quick problem-solving:
- **Header**: Title, date, status, and links
- **Problem Description**: Clear problem statement
- **Root Cause Analysis**: Identify the root cause
- **Solution**: Describe the implemented solution
- **Prevention**: Measures to prevent recurrence
- **Lessons Learned**: Key takeaways

### Using Templates

```bash
# Use default template (comprehensive 8D)
8d new "Complex Quality Issue"

# Use simple template (streamlined)
8d new "Simple incident" -t simple

# List available templates
8d template list
```

### Custom Templates

You can create custom templates for specific use cases:

```bash
# Create a new custom template
8d template create incident

# Create with a fixed title
8d template create security --title "Security Incident Report"

# View template content
8d template show incident

# Delete custom template
8d template delete incident
```

#### Template Placeholders

Custom templates support these placeholders:
- `{{title}}`: Report title
- `{{sequence}}`: Report sequence number (e.g., "0001")
- `{{date}}`: Creation date
- `{{links}}`: Links section (automatically populated)

#### Example Custom Template

```markdown
# {{title}}

**Date:** {{date}}
**Status:** Draft
{{links}}

## Incident Summary
<!-- Brief description of the incident -->

## Impact Assessment
<!-- What was affected and how -->

## Timeline
<!-- Chronological sequence of events -->

## Root Cause
<!-- Primary cause of the incident -->

## Resolution
<!-- Steps taken to resolve -->

## Follow-up Actions
<!-- Preventive measures and monitoring -->
```

## Linking Reports

8D-tools supports linking related reports with automatic bidirectional linking:

### Superseding Reports
```bash
8d new "Updated Solution" -s 3
```
This creates a new report that supersedes report #3, automatically adding:
- "Supersedes" link in the new report
- "Superseded by" link in report #3

### Custom Links
```bash
8d new "Related Analysis" -l "2:Amends:Amended by"
```
This creates links:
- "Amends" link in the new report pointing to #2
- "Amended by" link in report #2 pointing to the new report

### Manual Linking
```bash
8d link 1 4 "Related to"
```
This adds bidirectional "Related to" links between reports #1 and #4.

## Best Practices

1. **Use descriptive titles** that clearly identify the problem
2. **Initialize once per project** - the tool tracks the 8D directory location
3. **Link related reports** to maintain traceability
4. **Follow the 8D process** systematically through each discipline
5. **Update status** as you progress through the problem-solving process

## Development

### Building
```bash
npm run prepack
```

### Testing
```bash
npm test
```

### Type Checking
```bash
npm run types:check
```

## License

GPL-3.0

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/zanozbot/8d-tools).
