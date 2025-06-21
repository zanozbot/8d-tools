export interface TemplateData {
  title: string;
  sequence: string;
  date: string;
  links?: string[];
}

export function generateEightDTemplate(data: TemplateData): string {
  const { title, sequence, date, links = [] } = data;
  
  const linksSection = links.length > 0 
    ? `\n## Links\n\n${links.join('\n')}\n`
    : '';

  return `# ${sequence}: ${title}

**Date:** ${date}  
**Status:** Draft

${linksSection}
## D0: Plan and Prepare

### Problem Background
<!-- Describe the background of the problem and why it needs to be solved -->

### Prerequisites
<!-- List what is needed before starting the 8D process -->

### Initial Assessment
<!-- Provide initial assessment of the problem scope and impact -->

---

## D1: Form a Team

### Team Members
<!-- List team members and their roles -->

| Name | Role | Department | Responsibilities |
|------|------|------------|------------------|
|      |      |            |                  |

### Team Leader
<!-- Identify the team leader -->

### Team Charter
<!-- Define team goals, scope, and operating principles -->

---

## D2: Identify the Problem

### Problem Statement
<!-- Clear, specific description of the problem -->

### 5W2H Analysis
- **Who:** 
- **What:** 
- **When:** 
- **Where:** 
- **Why:** 
- **How:** 
- **How many:** 

### Problem Quantification
<!-- Quantify the problem with data, metrics, or measurements -->

### Supporting Evidence
<!-- Include photos, charts, data, or other evidence -->

---

## D3: Develop Interim Containment Plan

### Immediate Actions
<!-- List immediate actions to contain the problem -->

### Containment Verification
<!-- How will you verify the containment is effective? -->

### Customer Protection
<!-- How are customers protected while permanent solution is developed? -->

### Implementation Date
<!-- When was/will the containment be implemented? -->

---

## D4: Verify Root Causes and Escape Points

### Root Cause Analysis
<!-- Use tools like 5 Whys, Fishbone diagram, etc. -->

#### Potential Root Causes
1. 
2. 
3. 

#### Root Cause Verification
<!-- How were root causes verified? Include data/evidence -->

### Escape Points
<!-- Where in the process did the problem escape detection? -->

#### Why Wasn't It Caught?
<!-- Analysis of why existing controls failed -->

---

## D5: Choose Permanent Corrective Actions

### Proposed Solutions
<!-- List potential permanent corrective actions -->

1. **Solution 1:**
   - Description:
   - Pros:
   - Cons:
   - Risk Assessment:

2. **Solution 2:**
   - Description:
   - Pros:
   - Cons:
   - Risk Assessment:

### Selected Solution
<!-- Which solution was chosen and why? -->

### Verification Plan
<!-- How will you verify the solution works? -->

---

## D6: Implement Corrective Actions

### Implementation Plan
<!-- Detailed plan for implementing the permanent corrective action -->

| Action | Responsible | Target Date | Status |
|--------|-------------|-------------|--------|
|        |             |             |        |

### Implementation Verification
<!-- Evidence that implementation was successful -->

### Monitoring Plan
<!-- How will ongoing effectiveness be monitored? -->

---

## D7: Take Preventive Measures

### System Improvements
<!-- What system changes prevent similar problems? -->

### Process Updates
<!-- Document any process changes -->

### Training Requirements
<!-- What training is needed to prevent recurrence? -->

### Standard Work Updates
<!-- How are standard procedures updated? -->

---

## D8: Celebrate with Your Team

### Team Recognition
<!-- How was the team recognized for their work? -->

### Lessons Learned
<!-- Key lessons learned from this 8D process -->

### Knowledge Sharing
<!-- How will lessons be shared with the organization? -->

### Celebration Activities
<!-- How did the team celebrate success? -->

---

## Summary

### Problem Resolution
<!-- Brief summary of how the problem was resolved -->

### Key Metrics
<!-- Before/after metrics showing improvement -->

### Next Steps
<!-- Any follow-up actions or monitoring required -->

---

*This 8D report was generated using [8d-tools](https://github.com/zanozbot/8d-tools)*
`;
}
