export interface TemplateData {
  title: string;
  sequence: string;
  date: string;
  links?: string[];
}

export function generateEightDTemplate(data: TemplateData): string {
  const { title, sequence, date, links = [] } = data;
  
  const linksSection = links.length > 0 
    ? `\n## Links\n\n${links.join('\n')}`
    : '';

  return `# ${sequence}: ${title}

**Date:** ${date}  
**Status:** Draft
${linksSection}
## D0: Plan and prepare

### Problem background
<!-- Describe the background of the problem and why it needs to be solved -->

### Prerequisites
<!-- List what is needed before starting the 8D process -->

### Initial assessment
<!-- Provide initial assessment of the problem scope and impact -->

---

## D1: Form a team

### Team members
<!-- List team members and their roles -->

| Name | Role | Department | Responsibilities |
|------|------|------------|------------------|
|      |      |            |                  |

### Team leader
<!-- Identify the team leader -->

### Team charter
<!-- Define team goals, scope, and operating principles -->

---

## D2: Identify the problem

### Problem statement
<!-- Clear, specific description of the problem -->

### 5W2H analysis
- **Who:** 
- **What:** 
- **When:** 
- **Where:** 
- **Why:** 
- **How:** 
- **How many:** 

### Problem quantification
<!-- Quantify the problem with data, metrics, or measurements -->

### Supporting evidence
<!-- Include photos, charts, data, or other evidence -->

---

## D3: Develop interim containment plan

### Immediate actions
<!-- List immediate actions to contain the problem -->

### Containment verification
<!-- How will you verify the containment is effective? -->

### Customer protection
<!-- How are customers protected while permanent solution is developed? -->

### Implementation date
<!-- When was/will the containment be implemented? -->

---

## D4: Verify root causes and escape points

### Root cause analysis
<!-- Use tools like 5 Whys, Fishbone diagram, etc. -->

#### Potential root causes
1. 
2. 
3. 

#### Root cause verification
<!-- How were root causes verified? Include data/evidence -->

### Escape points
<!-- Where in the process did the problem escape detection? -->

#### Why wasn't it caught?
<!-- Analysis of why existing controls failed -->

---

## D5: Choose permanent corrective actions

### Proposed solutions
<!-- List potential permanent corrective actions -->

1. **Solution 1:**
   - Description:
   - Pros:
   - Cons:
   - Risk assessment:

2. **Solution 2:**
   - Description:
   - Pros:
   - Cons:
   - Risk assessment:

### Selected solution
<!-- Which solution was chosen and why? -->

### Verification plan
<!-- How will you verify the solution works? -->

---

## D6: Implement corrective actions

### Implementation plan
<!-- Detailed plan for implementing the permanent corrective action -->

| Action | Responsible | Target Date | Status |
|--------|-------------|-------------|--------|
|        |             |             |        |

### Implementation verification
<!-- Evidence that implementation was successful -->

### Monitoring plan
<!-- How will ongoing effectiveness be monitored? -->

---

## D7: Take preventive measures

### System improvements
<!-- What system changes prevent similar problems? -->

### Process updates
<!-- Document any process changes -->

### Training requirements
<!-- What training is needed to prevent recurrence? -->

### Standard work updates
<!-- How are standard procedures updated? -->

---

## D8: Celebrate with your team

### Team recognition
<!-- How was the team recognized for their work? -->

### Lessons learned
<!-- Key lessons learned from this 8D process -->

### Knowledge sharing
<!-- How will lessons be shared with the organization? -->

### Celebration activities
<!-- How did the team celebrate success? -->

---

## Summary

### Problem resolution
<!-- Brief summary of how the problem was resolved -->

### Key metrics
<!-- Before/after metrics showing improvement -->

### Next steps
<!-- Any follow-up actions or monitoring required -->

---

*This 8D report was generated using [8d-tools](https://github.com/zanozbot/8d-tools).*
`;
}
