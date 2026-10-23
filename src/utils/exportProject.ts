import JSZip from 'jszip';
import { STARTER_FILES, BACKEND_FOLDER_STRUCTURE } from '../data/backendStarterCode';

export async function downloadStarterProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Add Project README and Structure
  zip.file('README.md', `# ProTrack - Jira-Style Issue Tracker
Full Stack Starter Project: React + TypeScript + Java Spring Boot 3 + MySQL 8.0

${BACKEND_FOLDER_STRUCTURE}

See backend/README.md for detailed local laptop run instructions.
`);

  // Add all backend starter files
  for (const file of STARTER_FILES) {
    zip.file(file.path, file.content);
  }

  // Generate ZIP blob
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Trigger download
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'protrack-fullstack-starter.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
