# 8D Tools Usage Guide

This guide provides detailed instructions for using 8D Tools to manage Eight Disciplines problem-solving reports.

## Getting Started

### 1. Installation
```bash
npm install -g @zanozbot/8d-tools
```

### 2. Initialize Your Project
Navigate to your project directory and initialize the 8D structure:
```bash
cd your-project
8d init
```

This creates:
- `.8d-dir` file (points to your 8D directory)
- `docs/8d/` directory (default location)
- `.8d-sequence.lock` file (tracks report numbers)
- `README.md` table of contents

### 3. Create Your First Report
```bash
8d new "Product Quality Issue"
```

This generates `0001-product-quality-issue.md` with the complete 8D template.

## Workflow Examples

### Basic Problem-Solving Workflow

1. **Initialize** (once per project):
   ```bash
   8d init
   ```

2. **Create initial report**:
   ```bash
   8d new "Customer Complaint - Defective Batch"
   ```

3. **Work through the 8D process** by editing the generated markdown file

4. **Create follow-up reports** if needed:
   ```bash
   8d new "Supplier Quality Audit" -l "1:Related to:Related to"
   ```

### Advanced Linking Scenarios

#### Superseding a Previous Report
When you need to replace an earlier analysis:
```bash
8d new "Updated Root Cause Analysis" -s 3
```
This:
- Creates a new report that supersedes report #3
- Adds "Supersedes" link in the new report
- Adds "Superseded by" link in report #3

#### Creating Related Reports
For related but separate analyses:
```bash
8d new "Supplier Audit Results" -l "2:Amends:Amended by"
```
This creates bidirectional links between the new report and report #2.

#### Manual Linking
To link existing reports after creation:
```bash
8d link 1 4 "Related to"
```

## Directory Structure

After initialization and creating reports:

```
your-project/
├── .8d-dir                           # Points to docs/8d
├── docs/8d/                          # 8D reports directory
│   ├── .8d-sequence.lock            # Current sequence: 3
│   ├── README.md                     # Table of contents
│   ├── 0001-customer-complaint.md   # First report
│   ├── 0002-supplier-audit.md       # Second report
│   └── 0003-updated-analysis.md     # Third report
└── other-project-files...
```

## Report Template Structure

Each 8D report includes:

### Header Section
- Title with sequence number
- Date and status
- Links to related reports

### Eight Disciplines
- **D0: Plan and Prepare** - Problem background and planning
- **D1: Form a Team** - Team composition and charter
- **D2: Identify the Problem** - Problem statement and 5W2H analysis
- **D3: Develop Interim Containment** - Immediate actions
- **D4: Verify Root Causes** - Root cause analysis and escape points
- **D5: Choose Corrective Actions** - Solution selection
- **D6: Implement Actions** - Implementation planning
- **D7: Preventive Measures** - System improvements
- **D8: Celebrate** - Team recognition and lessons learned

### Summary Section
- Problem resolution summary
- Key metrics and outcomes
- Next steps

## Best Practices

### Report Management
1. **Use descriptive titles** that clearly identify the problem
2. **Create reports promptly** when problems are identified
3. **Link related reports** to maintain traceability
4. **Update status** as you progress through disciplines

### Team Collaboration
1. **Share the report location** with team members
2. **Use version control** (git) to track changes
3. **Review reports together** during team meetings
4. **Document decisions** in the appropriate sections

### Quality Assurance
1. **Follow the 8D process** systematically
2. **Provide evidence** for root causes and solutions
3. **Verify effectiveness** of corrective actions
4. **Document lessons learned** for future reference

## Troubleshooting

### Common Issues

**"8D directory not initialized"**
- Run `8d init` in your project root directory

**"Report not found"**
- Check the sequence number exists
- Verify you're in the correct directory
- Check `.8d-dir` file points to correct location

**"File already exists"**
- Each report gets a unique sequence number
- If you see this error, there may be a file system issue

### Getting Help
```bash
8d help                    # Show all commands
8d help <command>          # Show help for specific command
```

## Integration with Other Tools

### Version Control (Git)
Add 8D reports to your repository:
```bash
git add .8d-dir docs/8d/
git commit -m "Add 8D problem-solving reports"
```

### Project Management
- Link 8D reports in issue trackers
- Reference report numbers in commit messages
- Include reports in project documentation

### Quality Management Systems
- Export reports to PDF for formal documentation
- Include in quality audits and reviews
- Use as evidence for compliance requirements

## Advanced Usage

### Custom Directory Structure
```bash
8d init quality/8d-reports    # Custom directory
```

### Batch Operations
```bash
# Create multiple related reports
8d new "Problem Analysis"
8d new "Supplier Investigation" -l "1:Related to:Related to"
8d new "Process Improvement" -l "1:Extends:Extended by"
```

### Report Status Tracking
Edit the status field in each report:
- `Draft` - Initial creation
- `In Progress` - Active investigation
- `Under Review` - Team review phase
- `Completed` - Fully resolved
- `Closed` - Archived

This guide covers the essential usage patterns for 8D Tools. For more examples, see the sample reports in the `examples/` directory.
