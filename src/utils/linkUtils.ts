import fs from "fs-extra";

export async function addLinkToReport(
  filePath: string,
  linkText: string
): Promise<void> {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split("\n");

  // Check if link already exists
  if (content.includes(linkText)) {
    return; // Link already exists
  }

  // Find the Links section or create it
  const linksIndex = lines.findIndex((line) => line.trim() === "## Links");

  if (linksIndex !== -1) {
    // Links section exists, add the new link
    let insertIndex = linksIndex + 1;

    // Skip empty lines
    while (insertIndex < lines.length && lines[insertIndex].trim() === "") {
      insertIndex++;
    }

    lines.splice(insertIndex, 0, `- ${linkText}`);
  } else {
    // Create Links section - try different insertion points
    let insertIndex = -1;

    // First, try after the status line
    const statusIndex = lines.findIndex((line) => line.includes("**Status:**"));
    if (statusIndex !== -1) {
      insertIndex = statusIndex + 1;
    } else {
      // If no status line, try after the date line
      const dateIndex = lines.findIndex((line) => line.includes("**Date:**"));
      if (dateIndex !== -1) {
        insertIndex = dateIndex + 1;
      } else {
        // If no date line, try after the title (first non-empty line starting with #)
        const titleIndex = lines.findIndex((line) =>
          line.trim().startsWith("#")
        );
        if (titleIndex !== -1) {
          insertIndex = titleIndex + 1;
        } else {
          // Last resort: add at the beginning
          insertIndex = 0;
        }
      }
    }

    if (insertIndex !== -1) {
      lines.splice(insertIndex, 0, "", "## Links", "", `- ${linkText}`);
    }
  }

  await fs.writeFile(filePath, lines.join("\n"));
}

export function getReverseLink(linkType: string): string {
  const reverseMappings: { [key: string]: string } = {
    Supersedes: "Superseded by",
    "Superseded by": "Supersedes",
    "Related to": "Related to",
    Amends: "Amended by",
    "Amended by": "Amends",
    Clarifies: "Clarified by",
    "Clarified by": "Clarifies",
    Extends: "Extended by",
    "Extended by": "Extends",
  };

  return reverseMappings[linkType] || "Related to";
}
