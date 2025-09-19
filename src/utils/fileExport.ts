/**
 * Export transcript content as a downloadable text file
 * @param content - The transcript text to export
 * @param projectName - Name of the project (default: 'transcript')
 */
export const exportTranscript = (content: string, projectName: string = 'transcript'): void => {
  if (!content.trim()) {
    throw new Error('Cannot export empty transcript');
  }

  // Generate timestamp in format: YYYY-MM-DD_HH-mm-ss
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .replace(/\..+/, '');

  // Clean project name for filename (remove invalid characters)
  const cleanProjectName = projectName
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const filename = `${cleanProjectName || 'transcript'}_${timestamp}.txt`;

  // Add header with metadata
  const exportContent = `CarelessLive Transcript
Project: ${projectName}
Exported: ${now.toLocaleString()}
---

${content}`;

  // Create and trigger download
  try {
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export file');
  }
};

/**
 * Check if the browser supports file downloads
 */
export const isExportSupported = (): boolean => {
  return !!(
    window.Blob && 
    window.URL && 
    window.URL.createObjectURL && 
    document.createElement
  );
};