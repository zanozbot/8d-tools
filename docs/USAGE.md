# 8D Tools Usage Guide

This comprehensive guide covers all aspects of using 8d-tools for effective problem-solving documentation.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Workflow](#basic-workflow)
- [Command Reference](#command-reference)
- [Templates](#templates)
- [Linking Reports](#linking-reports)
- [File Organization](#file-organization)
- [Best Practices](#best-practices)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Installation Options

**Option 1: Global Installation (Recommended)**
```bash
npm install -g @zanozbot/8d-tools
```

**Option 2: Use without Installation**
```bash
# With npx (Node.js)
npx @zanozbot/8d-tools <command>

# With bunx (Bun)
bunx @zanozbot/8d-tools <command>
```

### First Steps

1. **Initialize your 8D workspace:**
   ```bash
   8d init
   # or specify custom directory
   8d init reports/quality-issues
   ```

2. **Create your first report:**
   ```bash
   8d new "Product Quality Issue"
   ```

3. **View the generated files:**
   ```bash
   ls docs/8d/
   cat docs/8d/0001-product-quality-issue.md
   ```

## Basic Workflow

### 1. Problem Identification
When a problem occurs, start by creating a new 8D report:

```bash
8d new "Manufacturing Defect - Adhesive Bond Failure"
```

This creates:
- A new report file: `0001-manufacturing-defect-adhesive-bond-failure.md`
- Updates the table of contents
- Assigns the next sequence number

### 2. Choose the Right Template

**For complex problems requiring full 8D methodology:**
```bash
8d new "Complex Quality Issue" -t default
```

**For quick incidents or simple problems:**
```bash
8d new "Server Downtime" -t simple
```

**For specific use cases with custom templates:**
```bash
8d new "Security Incident" -t security
```

### 3. Link Related Reports

**When superseding an old report:**
```bash
8d new "Updated Process Documentation" -s 3
```

**When creating related reports:**
```bash
8d new "Follow-up Investigation" -l "2:Related to:Related to"
```

**Link existing reports:**
```bash
8d link 1 2 "Supersedes"
```

## Command Reference

### `8d init [directory]`

Initializes the 8D directory structure.

**Parameters:**
- `directory` (optional): Target directory (default: `docs/8d`)

**Examples:**
```bash
8d init                    # Creates docs/8d/
8d init quality/8d         # Creates quality/8d/
8d init /path/to/reports   # Creates absolute path
```

**What it creates:**
- `.8d-dir` file (points to 8D directory)
- 8D directory with `.8d-sequence.lock`
- `README.md` (table of contents)
- `.templates/` directory for custom templates

### `8d new <title> [options]`

Creates a new 8D report.

**Parameters:**
- `title`: Report title (required)

**Options:**
- `-t, --template <name>`: Template to use (default: "default")
- `-s, --supersede <number>`: Supersede existing report
- `-l, --link <link>`: Link to existing report

**Examples:**
```bash
# Basic report
8d new "Quality Issue"

# With specific template
8d new "Quick Fix" -t simple

# Superseding report #3
8d new "Updated Solution" -s 3

# Linked report
8d new "Related Issue" -l "1:Related to:Related to"
```

**Link Format:**
`"<target_number>:<link_type>:<reverse_link_type>"`

Common link types:
- `Supersedes` ↔ `Superseded by`
- `Related to` ↔ `Related to`
- `Amends` ↔ `Amended by`
- `Clarifies` ↔ `Clarified by`

### `8d link <source> <target> [linkType]`

Links two existing reports.

**Parameters:**
- `source`: Source report number
- `target`: Target report number  
- `linkType` (optional): Link type (default: "Supersedes")

**Examples:**
```bash
8d link 1 2              # 1 supersedes 2
8d link 1 2 "Related to" # 1 related to 2
8d link 3 4 "Amends"     # 3 amends 4
```

### `8d template [action] [name] [options]`

Manage templates.

**Actions:**
- `list`: Show all available templates
- `create <name>`: Create new custom template
- `show <name>`: Display template content
- `delete <name>`: Remove custom template

**Examples:**
```bash
8d template list
8d template create incident
8d template show simple
8d template delete old-template
```

## Templates

### Built-in Templates

#### Default Template
Comprehensive 8D methodology covering all disciplines:
- Complete problem analysis (5W2H)
- Team formation and charter
- Root cause analysis
- Solution evaluation
- Implementation planning
- Preventive measures

#### Simple Template  
Streamlined for quick incidents:
- Essential 8D structure
- Simplified sections
- Faster completion
- Suitable for minor issues

### Custom Templates

Create templates for specific use cases:

```bash
8d template create security --title "Security Incident Report"
```

**Template Placeholders:**
- `{{title}}`: Report title
- `{{sequence}}`: Sequence number (1, 2, 3...)
- `{{date}}`: Creation date
- `{{links}}`: Links section

**Example Custom Template:**
```markdown
# {{title}}

- **Date:** {{date}}
- **Status:** Draft
{{links}}

## Incident Summary
<!-- Brief description -->

## Impact Assessment
<!-- What was affected -->

## Timeline
<!-- Sequence of events -->
```

## Linking Reports

### Automatic Linking

**Superseding Reports:**
```bash
8d new "Updated Process" -s 2
```
- Creates new report that supersedes #2
- Adds "Supersedes" link to new report
- Adds "Superseded by" link to report #2

**Related Reports:**
```bash
8d new "Follow-up" -l "1:Related to:Related to"
```
- Creates bidirectional "Related to" links

### Manual Linking

Link existing reports after creation:
```bash
8d link 1 3 "Clarifies"
```

### Link Types

Choose appropriate link types:
- **Supersedes/Superseded by**: New version replaces old
- **Related to**: Connected but independent issues
- **Amends/Amended by**: Corrections or additions
- **Clarifies/Clarified by**: Explanations or details
- **Extends/Extended by**: Builds upon previous work

## File Organization

### Directory Structure
```
project-root/
├── .8d-dir                    # Points to 8D directory
└── docs/8d/                   # Default 8D directory
    ├── .8d-sequence.lock      # Sequence tracking
    ├── .templates/            # Custom templates
    ├── README.md              # Table of contents
    ├── 0001-first-issue.md    # Reports with zero-padded numbers
    └── 0002-second-issue.md
```

### File Naming Convention

**Filenames:** Zero-padded sequence numbers
- `0001-product-quality-issue.md`
- `0002-server-downtime-incident.md`
- `0010-customer-complaint.md`

**Titles:** Simple numbers
- `# 1: Product Quality Issue`
- `# 2: Server Downtime Incident`
- `# 10: Customer Complaint`

### Table of Contents

Automatically maintained in `README.md`:
```markdown
## Reports

- [1: Product Quality Issue](./0001-product-quality-issue.md)
- [2: Server Downtime](./0002-server-downtime.md)
```

## Best Practices

### Report Creation

1. **Use descriptive titles:**
   ```bash
   # Good
   8d new "Manufacturing Line 3 - Adhesive Bond Failure in Product X"
   
   # Avoid
   8d new "Problem"
   ```

2. **Choose appropriate templates:**
   - Use `default` for complex quality issues
   - Use `simple` for quick incidents
   - Create custom templates for recurring scenarios

3. **Link related reports:**
   ```bash
   8d new "Root Cause Analysis" -l "1:Extends:Extended by"
   ```

### Documentation

1. **Complete all sections systematically**
2. **Use data and evidence to support findings**
3. **Include photos, charts, and measurements**
4. **Document lessons learned**
5. **Update status as work progresses**

### Team Collaboration

1. **Define clear roles and responsibilities**
2. **Set realistic timelines**
3. **Regular progress reviews**
4. **Share knowledge across teams**

## Advanced Usage

### Batch Operations

Create multiple related reports:
```bash
8d new "Initial Investigation" -t simple
8d new "Detailed Analysis" -l "1:Extends:Extended by"
8d new "Implementation Plan" -l "2:Follows:Followed by"
```

### Custom Workflows

For recurring problem types, create:
1. Custom templates
2. Standard linking patterns
3. Documented procedures

### Integration

8d-tools works well with:
- Version control systems (Git)
- Documentation platforms
- Quality management systems
- Issue tracking tools

## Troubleshooting

### Common Issues

**"8D directory not initialized"**
```bash
8d init
```

**"Template not found"**
```bash
8d template list  # Check available templates
```

**"Report number not found" (for linking)**
```bash
ls docs/8d/       # Check existing reports
cat docs/8d/README.md  # View table of contents
```

**Permission errors**
```bash
# Check directory permissions
ls -la docs/8d/
# Or initialize in different location
8d init ~/my-8d-reports
```

### Getting Help

```bash
8d help                # General help
8d new --help          # Command-specific help
8d template --help     # Template management help
8d link --help         # Linking help
```

### Support

- GitHub Issues: https://github.com/zanozbot/8d-tools/issues
- Documentation: https://github.com/zanozbot/8d-tools
- Examples: See `examples/` directory in the repository

---

For more examples and detailed scenarios, see the [examples directory](../examples/README.md).
