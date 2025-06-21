import * as fs from 'fs-extra';
import * as path from 'path';
import { getEightDConfig } from './fileUtils';
import { generateEightDTemplate, TemplateData } from '../templates/default';
import { generateSimpleTemplate, SimpleTemplateData } from '../templates/simple';

export interface CustomTemplateData extends TemplateData {
  // Additional fields can be added here for custom templates
}

export async function getAvailableTemplates(): Promise<string[]> {
  const templates = ['default', 'simple'];
  
  try {
    const config = await getEightDConfig();
    const templatesDir = path.join(config.directory, '.templates');
    
    if (await fs.pathExists(templatesDir)) {
      const files = await fs.readdir(templatesDir);
      const customTemplates = files
        .filter(file => file.endsWith('.md'))
        .map(file => path.basename(file, '.md'));
      
      templates.push(...customTemplates);
    }
  } catch (error) {
    // If we can't read custom templates, just return default
  }
  
  return templates;
}

export async function templateExists(templateName: string): Promise<boolean> {
  if (templateName === 'default' || templateName === 'simple') {
    return true;
  }
  
  try {
    const config = await getEightDConfig();
    const templatesDir = path.join(config.directory, '.templates');
    const templatePath = path.join(templatesDir, `${templateName}.md`);
    
    return await fs.pathExists(templatePath);
  } catch (error) {
    return false;
  }
}

export async function generateReportFromTemplate(
  templateName: string,
  data: CustomTemplateData
): Promise<string> {
  if (templateName === 'default') {
    return generateEightDTemplate(data);
  }

  if (templateName === 'simple') {
    return generateSimpleTemplate(data);
  }
  
  try {
    const config = await getEightDConfig();
    const templatesDir = path.join(config.directory, '.templates');
    const templatePath = path.join(templatesDir, `${templateName}.md`);
    
    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template "${templateName}" not found`);
    }
    
    let content = await fs.readFile(templatePath, 'utf8');
    
    // Replace placeholders
    content = content.replace(/\{\{title\}\}/g, data.title);
    content = content.replace(/\{\{sequence\}\}/g, data.sequence);
    content = content.replace(/\{\{date\}\}/g, data.date);
    
    // Handle links section
    if (data.links && data.links.length > 0) {
      const linksSection = `\n## Links\n\n${data.links.join('\n')}\n`;
      content = content.replace(/\{\{links\}\}/g, linksSection);
    } else {
      content = content.replace(/\{\{links\}\}/g, '');
    }
    
    return content;
  } catch (error) {
    throw new Error(`Failed to generate report from template "${templateName}": ${error}`);
  }
}

export async function getTemplateInfo(templateName: string): Promise<{
  name: string;
  title: string;
  isBuiltIn: boolean;
  path?: string;
}> {
  if (templateName === 'default') {
    return {
      name: 'default',
      title: 'Standard 8D problem-solving template',
      isBuiltIn: true
    };
  }

  if (templateName === 'simple') {
    return {
      name: 'simple',
      title: 'Simple problem-solving template',
      isBuiltIn: true
    };
  }
  
  try {
    const config = await getEightDConfig();
    const templatesDir = path.join(config.directory, '.templates');
    const templatePath = path.join(templatesDir, `${templateName}.md`);
    
    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template "${templateName}" not found`);
    }
    
    const content = await fs.readFile(templatePath, 'utf8');
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'No title';
    
    return {
      name: templateName,
      title,
      isBuiltIn: false,
      path: templatePath
    };
  } catch (error) {
    throw new Error(`Failed to get template info for "${templateName}": ${error}`);
  }
}

export function validateTemplateName(name: string): boolean {
  // Template names should be alphanumeric with hyphens and underscores
  const validNameRegex = /^[a-zA-Z0-9_-]+$/;
  return validNameRegex.test(name) && name.length > 0 && name.length <= 50;
}

export async function ensureTemplatesDirectory(): Promise<string> {
  const config = await getEightDConfig();
  const templatesDir = path.join(config.directory, '.templates');
  await fs.ensureDir(templatesDir);
  return templatesDir;
}
