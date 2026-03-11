import { type User, type InsertUser, type Question, type InsertQuestion, type Answer, type InsertAnswer } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestionsBySubject(subject: string): Promise<Question[]>;
  searchQuestions(query: string): Promise<Question[]>;
  getRecentQuestions(limit?: number): Promise<Question[]>;
  
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  getAnswerByQuestionId(questionId: string): Promise<Answer | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Map<string, Question>;
  private answers: Map<string, Answer>;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.answers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      ...insertQuestion,
      id,
      createdAt: new Date(),
    };
    this.questions.set(id, question);
    return question;
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsBySubject(subject: string): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter((q) => q.subject === subject)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async searchQuestions(query: string): Promise<Question[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.questions.values())
      .filter((q) => 
        q.question.toLowerCase().includes(searchTerm) ||
        q.subject.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getRecentQuestions(limit: number = 10): Promise<Question[]> {
    return Array.from(this.questions.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const id = randomUUID();
    const answer: Answer = {
      ...insertAnswer,
      id,
      createdAt: new Date(),
    };
    this.answers.set(id, answer);
    return answer;
  }

  async getAnswerByQuestionId(questionId: string): Promise<Answer | undefined> {
    return Array.from(this.answers.values()).find(
      (answer) => answer.questionId === questionId
    );
  }
}

export const storage = new MemStorage();
