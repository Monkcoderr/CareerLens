const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Configure the model to force JSON output
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" } 
});

/**
 * Utility to extract JSON from AI text response
 * Gemini 1.5 is good at JSON, but this regex protects against markdown backticks
 */
const cleanJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
    
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) return JSON.parse(objectMatch[0]);
    
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);
    
    throw new Error('Could not parse AI response as JSON');
  }
};

const aiService = {
  // --- RESUME ANALYSIS ---
  analyzeResume: async (resumeText, targetRole) => {
    const prompt = `You are an expert ATS analyzer. Analyze this resume for the role: ${targetRole || 'Software Developer'}.
    Resume: """${resumeText.substring(0, 5000)}"""

    Return a JSON object with this EXACT structure:
    {
      "overallScore": 72,
      "atsCompatibility": 68,
      "sections": {
        "contact": { "score": 80, "feedback": "string" },
        "experience": { "score": 70, "feedback": "string" },
        "education": { "score": 75, "feedback": "string" },
        "skills": { "score": 65, "feedback": "string" },
        "projects": { "score": 60, "feedback": "string" },
        "formatting": { "score": 70, "feedback": "string" }
      },
      "keywords": ["found keywords"],
      "missingKeywords": ["important missing keywords"],
      "strengths": ["string"],
      "improvements": ["string"]
    }`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  },

  // --- MOCK INTERVIEW QUESTIONS ---
  generateInterviewQuestions: async (role, type, difficulty, count) => {
    const prompt = `You are a senior tech interviewer. Generate exactly ${count} ${difficulty}-level ${type} interview questions for a ${role} position.
    Return ONLY a valid JSON array of objects:
    [
      {
        "question": "string",
        "idealAnswer": "string",
        "keyPoints": ["point1", "point2"]
      }
    ]`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  },

  // --- ANSWER EVALUATION ---
  evaluateAnswer: async (question, userAnswer, role) => {
    const prompt = `You are a senior interviewer evaluating a candidate for ${role} role.
    Question: "${question}"
    Candidate Answer: "${userAnswer}"

    Evaluate and return as JSON:
    {
      "score": 75,
      "feedback": "string",
      "strengths": ["string"],
      "improvements": ["string"],
      "idealAnswer": "string"
    }`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  },

  // --- COVER LETTER GENERATION ---
  generateCoverLetter: async (resumeText, jobDescription, company, position) => {
    const prompt = `Write a professional cover letter for ${position} at ${company}.
    Resume Highlights: "${resumeText.substring(0, 2000)}"
    Job Description: "${jobDescription.substring(0, 2000)}"

    Return as JSON:
    {
      "coverLetter": "The full letter text with \\n for newlines",
      "matchScore": 85,
      "highlightedSkills": ["skill1", "skill2"],
      "tips": ["tip1"]
    }`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  },

  // --- SKILL GAP ANALYSIS ---
  analyzeSkillGap: async (skills, targetRole) => {
    const prompt = `Analyze the skill gap for ${targetRole} given current skills: ${skills.join(', ')}.
    Return as JSON:
    {
      "matchPercentage": 65,
      "strongSkills": ["string"],
      "missingCritical": ["string"],
      "missingNiceToHave": ["string"],
      "learningPath": [{ "skill": "string", "priority": "high", "estimatedTime": "string", "resources": ["string"] }],
      "roadmap": "overall strategy string"
    }`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  }
};

module.exports = aiService;