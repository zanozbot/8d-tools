# 8D Tools Examples

This directory contains example 8D reports demonstrating the different templates available in 8d-tools. These examples show how to structure and complete 8D problem-solving reports for various types of incidents and issues.

## Available Examples

### 1. Default Template Example

**File:** `default-template-example.md`  
**Scenario:** Manufacturing quality issue with adhesive bond failures  
**Template:** `default` (comprehensive 8D template)

This example demonstrates:

- Complete 8D methodology with all disciplines (D0-D8)
- Detailed problem analysis and root cause investigation
- Comprehensive team formation and charter
- Thorough corrective and preventive actions
- Proper documentation of lessons learned and celebration

**Key features shown:**

- 5W2H analysis for problem identification
- Multiple solution evaluation and selection
- Detailed implementation planning with timelines
- Comprehensive preventive measures
- Links to related reports

### 2. Simple Template Example

**File:** `simple-template-example.md`  
**Scenario:** IT incident with database connection failure  
**Template:** `simple` (streamlined template)

This example demonstrates:

- Streamlined 8D process for quick resolution
- Focused problem statement and description
- Essential team coordination
- Rapid containment and corrective actions
- Efficient documentation for faster incidents

**Key features shown:**

- Concise problem description
- Immediate containment actions
- Root cause identification with escape points
- Implementation tracking table
- Preventive measures and monitoring

## How These Examples Were Created

These examples were generated using the 8d-tools CLI commands:

```bash
# Default template example (comprehensive)
8d new "Product Quality Issue - Manufacturing Defect" -t default

# Simple template example (streamlined)
8d new "Server Downtime Incident - Database Connection Failure" -t simple -l "1:Supersedes:Superseded by"
```

## Template Comparison

| Aspect               | Default Template                        | Simple Template                 |
| -------------------- | --------------------------------------- | ------------------------------- |
| **Complexity**       | Comprehensive, detailed                 | Streamlined, focused            |
| **Use Case**         | Complex problems, formal investigations | Quick incidents, routine issues |
| **Time to Complete** | 2-4 hours                               | 30-60 minutes                   |
| **Detail Level**     | High - extensive documentation          | Medium - essential information  |
| **Team Size**        | 5-8 members typical                     | 3-5 members typical             |
| **Documentation**    | Full 8D methodology                     | Core 8D principles              |

## When to Use Each Template

### Use Default Template When:

- Problem has significant business impact
- Root cause is complex or unknown
- Multiple departments are involved
- Formal documentation is required
- Regulatory compliance is needed
- Long-term prevention is critical

### Use Simple Template When:

- Problem is well-understood
- Quick resolution is needed
- Limited resources available
- Incident is routine or recurring
- Documentation needs are minimal
- Team is experienced with 8D

## Template Features Demonstrated

### Common Features (Both Templates)

- **Header section** with title, date, status, and links
- **Problem identification** and clear description
- **Team formation** with roles and responsibilities
- **Root cause analysis** and verification
- **Corrective actions** with implementation plans
- **Preventive measures** to avoid recurrence
- **Review and closure** with lessons learned

### Default Template Specific Features

- **D0: Plan and prepare** - Prerequisites and initial assessment
- **5W2H analysis** - Systematic problem investigation
- **Team charter** - Formal team goals and operating principles
- **Multiple solution evaluation** - Pros/cons analysis
- **Detailed implementation tracking** - Comprehensive project management
- **Celebration section** - Team recognition and knowledge sharing

### Simple Template Specific Features

- **Streamlined sections** - Combined related activities
- **Focused documentation** - Essential information only
- **Quick implementation** - Simplified tracking
- **Efficient format** - Faster completion

## Using These Examples

1. **Study the structure** - See how each section is organized and completed
2. **Adapt the content** - Modify examples for your specific use cases
3. **Follow the format** - Use consistent formatting and section headers
4. **Learn the methodology** - Understand the 8D problem-solving approach
5. **Practice with real issues** - Apply templates to actual problems

## Creating Your Own Reports

To create new 8D reports based on these examples:

```bash
# Initialize 8D directory structure
8d init

# Create a comprehensive report (default template)
8d new "Your Problem Title"

# Create a streamlined report (simple template)
8d new "Your Incident Title" -t simple

# Create linked reports
8d new "Follow-up Issue" -l "1:Related to:Related to"

# List available templates
8d template list
```

## Best Practices Shown

1. **Clear problem statements** - Specific, measurable, time-bound
2. **Quantified impact** - Numbers, costs, affected users
3. **Evidence-based analysis** - Data, logs, measurements
4. **Actionable solutions** - Specific, assigned, time-bound
5. **Verification methods** - How to confirm effectiveness
6. **Preventive thinking** - System improvements, not just fixes
7. **Team recognition** - Acknowledge contributions and learning

## Additional Resources

- [8D Methodology Guide](https://en.wikipedia.org/wiki/Eight_Disciplines_Problem_Solving)
- [Root Cause Analysis Techniques](https://en.wikipedia.org/wiki/Root_cause_analysis)
- [5 Whys Method](https://en.wikipedia.org/wiki/Five_whys)
- [Fishbone Diagram](https://en.wikipedia.org/wiki/Ishikawa_diagram)

For more information about 8d-tools, visit: https://github.com/zanozbot/8d-tools
