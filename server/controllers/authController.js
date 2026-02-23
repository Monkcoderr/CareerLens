// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

const cleanJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    throw new Error('Could not parse AI response as JSON');
  }
};

const aiService = {
  analyzeResume: async (resumeText, targetRole) => {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze this resume thoroughly.

${targetRole ? `Target Role: ${targetRole}` : 'General Analysis'}

Resume Text:
"""
${resumeText.substring(0, 4000)}
"""

You MUST return ONLY a valid JSON object with this EXACT structure (no markdown, no extra text):
{
  "overallScore": 72,
  "atsCompatibility": 68,
  "sections": {
    "contact": { "score": 80, "feedback": "Contact info is present with email and phone." },
    "experience": { "score": 70, "feedback": "Good experience but needs more quantified achievements." },
    "education": { "score": 75, "feedback": "Education section is well structured." },
    "skills": { "score": 65, "feedback": "Skills listed but missing some key technologies." },
    "projects": { "score": 60, "feedback": "Projects section could use more detail." },
    "formatting": { "score": 70, "feedback": "Overall formatting is clean." }
  },
  "keywords": ["JavaScript", "React", "Node.js"],
  "missingKeywords": ["TypeScript", "Docker", "AWS"],
  "strengths": ["Clear structure", "Relevant experience"],
  "improvements": ["Add more metrics", "Include certifications", "Add a summary section"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a resume analysis expert. Always respond with valid JSON only. No markdown formatting.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    return cleanJSON(content);
  },

  generateInterviewQuestions: async (role, type, difficulty, count) => {
    const prompt = `You are a senior tech interviewer. Generate exactly ${count} ${difficulty}-level ${type} interview questions for a ${role} position.

Return ONLY a valid JSON array (no markdown, no extra text):
[
  {
    "question": "Explain the concept of closures in JavaScript and give a practical example.",
    "idealAnswer": "A closure is a function that has access to variables from its outer scope...",
    "keyPoints": ["Lexical scoping", "Data privacy", "Function factories"]
  }
]

Generate exactly ${count} questions.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a technical interviewer. Always respond with valid JSON arrays only. No markdown.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const content = response.choices[0].message.content;
    return cleanJSON(content);
  },

  evaluateAnswer: async (question, userAnswer, role) => {
    const prompt = `You are a senior interviewer evaluating a candidate for ${role} role.

Question: "${question}"
Candidate Answer: "${userAnswer}"

Evaluate the answer and return ONLY valid JSON (no markdown):
{
  "score": 75,
  "feedback": "Good understanding of the concept but could provide more specific examples.",
  "strengths": ["Correct core concept", "Clear explanation"],
  "improvements": ["Add code examples", "Mention edge cases"],
  "idealAnswer": "A comprehensive answer would include..."
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an interview evaluator. Always respond with valid JSON only. No markdown.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    return cleanJSON(content);
  },

  generateCoverLetter: async (resumeText, jobDescription, company, position) => {
    const prompt = `Write a professional cover letter based on:

Resume highlights: "${resumeText.substring(0, 2000)}"
Job Description: "${jobDescription.substring(0, 2000)}"
Company: ${company}
Position: ${position}

Return ONLY valid JSON (no markdown):
{
  "coverLetter": "Dear Hiring Manager,\\n\\n...[full cover letter text]...\\n\\nSincerely,\\n[Name]",
  "matchScore": 78,
  "highlightedSkills": ["React", "Node.js", "MongoDB"],
  "tips": ["Customize the opening for the specific team", "Add a specific project that relates to their product"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional cover letter writer. Always respond with valid JSON only. No markdown.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    return cleanJSON(content);
  },

  analyzeSkillGap: async (skills, targetRole) => {
    const prompt = `Analyze the skill gap for someone targeting ${targetRole} role.

Current Skills: ${skills.join(', ')}

Return ONLY valid JSON (no markdown):
{
  "matchPercentage": 65,
  "strongSkills": ["JavaScript", "React"],
  "missingCritical": ["TypeScript", "System Design"],
  "missingNiceToHave": ["GraphQL", "Kubernetes"],
  "learningPath": [
    {
      "skill": "TypeScript",
      "priority": "high",
      "estimatedTime": "2 weeks",
      "resources": ["TypeScript Handbook", "Total TypeScript by Matt Pocock"]
    }
  ],
  "roadmap": "Focus on TypeScript first, then move to system design..."
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a career advisor. Always respond with valid JSON only. No markdown.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    return cleanJSON(content);
  }
};

module.exports = aiService;