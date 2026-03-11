import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AnswerResponse {
  quickAnswer: string;
  steps: string[];
  relatedTopics: string[];
  explanation: string;
}

export async function generateAnswer(question: string, subject: string): Promise<AnswerResponse> {
  try {
    const prompt = `You are an expert CBSE Class 10 tutor. A student has asked a question in ${subject}. Provide a comprehensive answer with the following structure:

Question: ${question}
Subject: ${subject}

Please respond with a JSON object containing:
1. "quickAnswer": A brief, direct answer to the question
2. "steps": An array of step-by-step explanations (3-6 steps maximum)
3. "relatedTopics": An array of 3-5 related topics the student should explore
4. "explanation": A detailed explanation suitable for Class 10 level

Make sure the answer is:
- Age-appropriate for Class 10 students
- Following CBSE curriculum guidelines
- Clear and easy to understand
- Includes examples where applicable
- Uses proper mathematical notation if it's a math question

Respond only with valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a helpful CBSE Class 10 tutor. Always respond with properly formatted JSON containing the requested fields."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      quickAnswer: result.quickAnswer || "Unable to generate answer",
      steps: Array.isArray(result.steps) ? result.steps : [],
      relatedTopics: Array.isArray(result.relatedTopics) ? result.relatedTopics : [],
      explanation: result.explanation || "Unable to generate detailed explanation"
    };
  } catch (error) {
    throw new Error(`Failed to generate answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function searchSimilarQuestions(query: string, subject?: string): Promise<string[]> {
  try {
    const prompt = `Generate 3-5 similar CBSE Class 10 questions related to: "${query}"${subject ? ` in ${subject}` : ''}. 
    
    Respond with a JSON object containing:
    - "questions": An array of similar question strings
    
    Make sure questions are:
    - Appropriate for CBSE Class 10 level
    - Varied in difficulty
    - Related but not identical to the original query
    
    Respond only with valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system", 
          content: "You are a CBSE Class 10 curriculum expert. Generate similar questions that would help students practice related concepts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return Array.isArray(result.questions) ? result.questions : [];
  } catch (error) {
    console.error('Error generating similar questions:', error);
    return [];
  }
}
