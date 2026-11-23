// Replace this demo adapter with your chosen AI provider's server-side API call.
// Keep provider keys in backend/.env only. Never put an AI key in frontend code.
export async function generateResume(profile, userName) {
  const skills = (profile.skills || []).join(', ') || 'relevant technical skills';
  const projects = (profile.projects || []).map(p => `${p.name}: ${p.description}`).join('; ');
  return {
    summary: `${userName} is a motivated candidate targeting ${profile.targetRole || 'a technology role'}, with experience in ${skills}.`,
    bulletPoints: [
      `Applied ${skills} while developing academic and personal projects.`,
      projects ? `Project experience: ${projects}` : 'Developed practical skills through academic learning and hands-on practice.',
      'Collaborated on tasks, documented work, and improved solutions through feedback.'
    ],
    notice: 'Demo-generated content. Connect an AI provider in aiService.js for live AI generation and verify all claims before using.'
  };
}
export async function generateInterview(profile, role) {
  const skills = (profile.skills || []).slice(0, 5);
  return {
    role,
    questions: [
      `Explain the core responsibilities of a ${role}.`,
      `Describe a project where you used ${skills[0] || 'a technical skill'}.`,
      `How would you debug a problem in a ${role} workflow?`,
      'Explain a technical concept you recently learned.',
      'Tell me about a challenge you faced in a project and how you approached it.'
    ],
    notice: 'Demo question set. Connect an AI provider in aiService.js for role-specific AI generation.'
  };
}
