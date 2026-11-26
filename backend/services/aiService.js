import OpenAI from 'openai';
const client = () => process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30000, maxRetries: 2 }) : null;
const text = value => typeof value === 'string' ? value : JSON.stringify(value ?? '');
const demoResume = (profile, userName) => {
  const skills = (profile.skills || []).map(text).join(', ') || 'relevant technical skills';
  const projects = (profile.projects || []).map(p => `${p.name || 'Project'}: ${p.description || ''}`).join('; ');
  return {
    summary: `${userName} is a motivated candidate targeting ${profile.targetRole || 'a technology role'}, with experience in ${skills}.`,
    bulletPoints: [
      `Applied ${skills} while developing academic and personal projects.`,
      projects ? `Project experience: ${projects}` : 'Developed practical skills through academic learning and hands-on practice.',
      'Collaborated on tasks, documented work, and improved solutions through feedback.'
    ],
    notice: 'Demo-generated content. Add OPENAI_API_KEY to enable live AI generation. Verify every claim before using.'
  };
};
const demoInterview = (profile, role) => {
  const skills = (profile.skills || []).slice(0, 5).map(text);
  return {
    role,
    questions: [
      `Explain the core responsibilities of a ${role}.`,
      `Describe a project where you used ${skills[0] || 'a technical skill'}.`,
      `How would you debug a problem in a ${role} workflow?`,
      'Explain a technical concept you recently learned.',
      'Tell me about a challenge you faced in a project and how you approached it.'
    ],
    notice: 'Demo question set. Add OPENAI_API_KEY to enable live AI generation.'
  };
};
async function generateJSON(system, input) {
  const openai = client();
  if (!openai) return null;
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify(input) }
    ]
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('The AI provider returned an empty response. Please try again.');
  try { return JSON.parse(content); }
  catch { throw new Error('The AI provider returned an invalid response. Please try again.'); }
}
export async function generateResume(profile, userName) {
  const input = {
    candidateName: userName,
    targetRole: profile.targetRole || '',
    headline: profile.headline || '',
    skills: profile.skills || [],
    education: profile.education || [],
    experience: profile.experience || [],
    projects: profile.projects || []
  };
  const generated = await generateJSON(
    'You are an expert ATS resume writer. Use only facts supplied in the candidate profile. Never invent employers, dates, degrees, metrics, achievements, tools, or experience. Return valid JSON with exactly: summary (string), bulletPoints (array of 4 to 6 concise achievement-oriented strings). If information is missing, phrase carefully without fabricating. Use clear professional language.',
    input
  );
  if (!generated) return demoResume(profile, userName);
  return {
    summary: String(generated.summary || ''),
    bulletPoints: Array.isArray(generated.bulletPoints) ? generated.bulletPoints.map(String).slice(0, 8) : [],
    notice: 'AI-generated draft. Review all details for accuracy before using.'
  };
}
export async function generateInterview(profile, role) {
  const input = {
    targetRole: role,
    headline: profile.headline || '',
    skills: profile.skills || [],
    education: profile.education || [],
    experience: profile.experience || [],
    projects: profile.projects || []
  };
  const generated = await generateJSON(
    'You are an experienced technical interviewer and career coach. Create 8 relevant interview questions for the specified target role, tailored to the candidate profile and skill level. Include a mix of technical, project-based, and behavioral questions. Return valid JSON with exactly: questions (array of 8 strings). Do not include answers or invent candidate experience.',
    input
  );
  if (!generated) return demoInterview(profile, role);
  return {
    role,
    questions: Array.isArray(generated.questions) ? generated.questions.map(String).slice(0, 8) : [],
    notice: 'Questions generated with OpenAI and tailored to your profile.'
  };
}
