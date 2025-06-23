export interface SimpleTemplateData {
  title: string;
  sequence: string;
  date: string;
  links?: string[];
}

export function generateSimpleTemplate(data: SimpleTemplateData): string {
  const { title, sequence, date, links = [] } = data;

  const linksSection =
    links.length > 0 ? `\n## Links\n\n${links.join("\n")}` : "";

  return `# ${sequence}: ${title}

- **Date:** ${date}
- **Status:** Draft
${linksSection}
## D0: Planning
<!-- Gather data, feedback, and prerequisites required to solve the problem. -->

## D1: Team members
<!-- List team members and their roles -->

| Name | Role | Department | Responsibilities |
|------|------|------------|------------------|
|      |      |            |                  |

## D2: Problem statement & description
<!-- Describe the problem clearly and concisely -->

## D3: Interim containment action
<!-- Describe any temporary actions or plans to put in place while determining a permanent corrective action. -->

## D4: Root cause & escape points
<!-- Identify all possible root causes and escape points for the problem. -->

## D5: Permanent corrective action
<!-- Compose a list of corrective actions to solve the problem and prevent similar issues from reoccurring. -->

## D6: Implementation plan
<!-- Develop a plan to implement your corrective actions, including who is responsible for each step and the completion deadline.  -->

## D7: Preventive measures
<!-- Describe any measure to implement to avoid similar problems in the future. -->

## D8: Review & closure
<!-- Review the 8D process and close the report. -->

---

*This 8D report was generated using [8d-tools](https://github.com/zanozbot/8d-tools).*
`;
}
