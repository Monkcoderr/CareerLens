const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We define the model once. 2.5-flash is perfect for fast JSON responses.
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" } // Forces JSON output
});

const cleanJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Regex fallback in case Gemini wraps the response in markdown blocks
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
  analyzeResume: async (resumeText, targetRole) => {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. 
    Analyze this resume for the role: ${targetRole || 'Software Developer'}.
    
    Resume: """${resumeText.substring(0, 5000)}"""

    Return a JSON object with: overallScore (0-100), atsCompatibility (0-100), 
    sections (contact, experience, education, skills, projects, formatting - each with score and feedback),
    keywords (found), missingKeywords, strengths (array), and improvements (array).`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  },

  generateInterviewQuestions: async (role, type, difficulty, count) => {
    const prompt = `You are a technical interviewer. Generate exactly ${count} ${difficulty} ${type} 
    questions for a ${role} position. Return as a JSON array of objects, 
    each with: question, idealAnswer, and keyPoints (array).`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  },

  evaluateAnswer: async (question, userAnswer, role) => {
    const prompt = `Evaluate this interview answer for a ${role} role.
    Question: "${question}"
    Candidate Answer: "${userAnswer}"
    
    Return JSON with: score (0-100), feedback, strengths (array), improvements (array), and idealAnswer.`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  },

  generateCoverLetter: async (resumeText, jobDescription, company, position) => {
    const prompt = `Write a professional cover letter for ${position} at ${company}.
    Resume: ${resumeText.substring(0, 2000)}
    Job Description: ${jobDescription.substring(0, 2000)}
    
    Return JSON with: coverLetter (string), matchScore (0-100), highlightedSkills (array), and tips (array).`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  },

  analyzeSkillGap: async (skills, targetRole) => {
    const prompt = `Analyze skill gap for ${targetRole} given current skills: ${skills.join(', ')}.
    Return JSON with: matchPercentage, strongSkills, missingCritical, missingNiceToHave, 
    learningPath (array of {skill, priority, estimatedTime, resources}), and roadmap (string).`;

    const result = await model.generateContent(prompt);
    return cleanJSON(result.response.text());
  }
};

module.exports = aiService;