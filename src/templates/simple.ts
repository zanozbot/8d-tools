export interface SimpleTemplateData {
  title: string;
  sequence: string;
  date: string;
  links?: string[];
}

export function generateSimpleTemplate(data: SimpleTemplateData): string {
  const { title, sequence, date, links = [] } = data;
  
  const linksSection = links.length > 0 
    ? `\n## Links\n\n${links.join('\n')}`
    : '';

  return `# ${sequence}: ${title}

**Date:** ${date}
**Status:** Draft
${linksSection}
## Problem Description
<!-- Describe the problem clearly and concisely -->

## Root Cause Analysis
<!-- Identify the root cause of the problem -->

## Solution
<!-- Describe the solution implemented -->

## Prevention
<!-- What measures will prevent this problem from recurring? -->

## Lessons Learned
<!-- Key takeaways from this problem-solving process -->

---

*This 8D report was generated using [8d-tools](https://github.com/zanozbot/8d-tools)*
`;
}
