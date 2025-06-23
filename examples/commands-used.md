# Commands Used to Generate Examples

This file documents the exact 8d-tools commands that were used to generate the example reports in this directory.

## Prerequisites

Before running these commands, make sure you have:

1. **Installed 8d-tools:**

   ```bash
   npm install -g @zanozbot/8d-tools
   ```

2. **Initialized 8D directory:**
   ```bash
   8d init
   ```

## Example Generation Commands

### 1. Default Template Example

**Command:**

```bash
8d new "Product Quality Issue - Manufacturing Defect"
```

**Explanation:**

- Uses the default template (comprehensive 8D)
- Creates report with sequence number 0001
- Generates file: `0001-product-quality-issue-manufacturing-defect.md`
- No template specified, so uses `default` template automatically

**Alternative explicit command:**

```bash
8d new "Product Quality Issue - Manufacturing Defect" -t default
```

### 2. Simple Template Example

**Command:**

```bash
8d new "Server Downtime Incident - Database Connection Failure" -t simple -l "1:Supersedes:Superseded by"
```

**Explanation:**

- Uses the simple template (`-t simple`)
- Creates report with sequence number 0002
- Links to report #1 with "Supersedes" relationship (`-l "1:Supersedes:Superseded by"`)
- Generates file: `0002-server-downtime-incident-database-connection-failure.md`
- Automatically adds reverse link to report #1

## Command Breakdown

### Basic New Report Command

```bash
8d new "<title>"
```

- Creates new 8D report with default template
- Auto-assigns next sequence number
- Generates filename from title

### Template Selection

```bash
8d new "<title>" -t <template>
```

Available templates:

- `default` - Comprehensive 8D template (default if not specified)
- `simple` - Streamlined template for quick incidents
- `<custom>` - Any custom template you've created

### Linking Reports

```bash
8d new "<title>" -l "<number>:<LinkType>:<ReverseLink>"
```

Link format: `"<target_number>:<link_type>:<reverse_link_type>"`

Common link types:

- `Supersedes` ↔ `Superseded by`
- `Related to` ↔ `Related to`
- `Amends` ↔ `Amended by`
- `Clarifies` ↔ `Clarified by`
- `Extends` ↔ `Extended by`

### Superseding Reports

```bash
8d new "<title>" -s <number>
```

- Creates new report that supersedes an existing one
- Automatically adds "Supersedes" link to new report
- Automatically adds "Superseded by" link to old report

## Additional Useful Commands

### List Available Templates

```bash
8d template list
```

### Show Template Content

```bash
8d template show <template_name>
```

### Create Custom Template

```bash
8d template create <template_name>
```

### Link Existing Reports

```bash
8d link <source_number> <target_number> [link_type]
```

Examples:

```bash
8d link 1 2                    # Uses default "Supersedes"
8d link 1 2 "Related to"       # Custom link type
```

### Help Commands

```bash
8d help                        # Show all commands
8d new --help                  # Show new command options
8d template --help             # Show template command options
8d link --help                 # Show link command options
```

## File Naming Convention

8d-tools automatically generates filenames using this pattern:

```
<zero-padded-sequence>-<title-kebab-case>.md
```

Examples:

- `0001-product-quality-issue-manufacturing-defect.md`
- `0002-server-downtime-incident-database-connection-failure.md`
- `0003-customer-complaint-response-delay.md`

## Directory Structure

After running the example commands, your directory structure will look like:

```
docs/8d/                                    # Default 8D directory
├── .8d-config.json                         # Configuration file
├── table-of-contents.md                    # Auto-generated TOC
├── 0001-product-quality-issue-manufacturing-defect.md
└── 0002-server-downtime-incident-database-connection-failure.md
```

## Recreating the Examples

To recreate these exact examples in your own environment:

1. **Initialize a new 8D directory:**

   ```bash
   mkdir my-8d-examples
   cd my-8d-examples
   8d init
   ```

2. **Create the default template example:**

   ```bash
   8d new "Product Quality Issue - Manufacturing Defect"
   ```

3. **Create the simple template example with link:**

   ```bash
   8d new "Server Downtime Incident - Database Connection Failure" -t simple -l "1:Supersedes:Superseded by"
   ```

4. **View the generated files:**
   ```bash
   ls -la docs/8d/
   cat docs/8d/0001-product-quality-issue-manufacturing-defect.md
   cat docs/8d/0002-server-downtime-incident-database-connection-failure.md
   ```

## Tips for Using These Commands

1. **Start simple:** Begin with basic `8d new "Title"` commands
2. **Use descriptive titles:** Clear titles make better filenames
3. **Link related reports:** Use linking to show relationships
4. **Choose appropriate templates:** Default for complex issues, simple for quick incidents
5. **Check the table of contents:** Auto-generated TOC shows all reports
6. **Use help commands:** Get detailed usage information when needed

## Troubleshooting

### Common Issues

**"Template not found" error:**

```bash
8d template list  # Check available templates
```

**"Report number not found" for linking:**

```bash
ls docs/8d/  # Check existing reports
```

**Permission errors:**

```bash
# Make sure you have write permissions in the current directory
# Or specify a different directory with 8d init <directory>
```

For more help, visit: https://github.com/zanozbot/8d-tools
