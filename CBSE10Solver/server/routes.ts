import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionSchema, insertAnswerSchema } from "@shared/schema";
import { generateAnswer, searchSimilarQuestions } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new question and generate AI answer
  app.post("/api/questions", async (req, res) => {
    try {
      const validatedData = insertQuestionSchema.parse(req.body);
      
      // Create question
      const question = await storage.createQuestion(validatedData);
      
      // Generate AI answer
      const aiResponse = await generateAnswer(question.question, question.subject);
      
      // Store the answer
      const answerData = {
        questionId: question.id,
        answer: aiResponse.explanation,
        steps: aiResponse.steps,
        relatedTopics: aiResponse.relatedTopics,
        quickAnswer: aiResponse.quickAnswer,
      };
      
      const answer = await storage.createAnswer(answerData);
      
      res.json({ question, answer });
    } catch (error) {
      console.error("Error creating question:", error);
      
      // Handle OpenAI-specific errors with user-friendly messages
      if (error instanceof Error) {
        if (error.message.includes("429") || error.message.includes("quota")) {
          return res.status(429).json({ 
            message: "OpenAI API quota exceeded. Please check your OpenAI billing and payment methods at https://platform.openai.com/settings/billing",
            type: "quota_exceeded"
          });
        }
        if (error.message.includes("401") || error.message.includes("invalid")) {
          return res.status(401).json({ 
            message: "Invalid OpenAI API key. Please check your API key configuration.",
            type: "invalid_api_key"
          });
        }
        if (error.message.includes("503") || error.message.includes("service")) {
          return res.status(503).json({ 
            message: "OpenAI service is temporarily unavailable. Please try again in a few minutes.",
            type: "service_unavailable"
          });
        }
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create question and generate answer",
        type: "general_error"
      });
    }
  });

  // Get a question with its answer
  app.get("/api/questions/:id", async (req, res) => {
    try {
      const question = await storage.getQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const answer = await storage.getAnswerByQuestionId(question.id);
      res.json({ question, answer });
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  // Get questions by subject
  app.get("/api/questions/subject/:subject", async (req, res) => {
    try {
      const questions = await storage.getQuestionsBySubject(req.params.subject);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions by subject:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Search questions
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const questions = await storage.searchQuestions(query);
      res.json(questions);
    } catch (error) {
      console.error("Error searching questions:", error);
      res.status(500).json({ message: "Failed to search questions" });
    }
  });

  // Get recent questions
  app.get("/api/questions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const questions = await storage.getRecentQuestions(limit);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching recent questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Get similar questions using AI
  app.post("/api/similar-questions", async (req, res) => {
    try {
      const { query, subject } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      const similarQuestions = await searchSimilarQuestions(query, subject);
      res.json({ questions: similarQuestions });
    } catch (error) {
      console.error("Error generating similar questions:", error);
      res.status(500).json({ message: "Failed to generate similar questions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
