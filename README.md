# CBSE Class 10 Helper

## Overview

This is a full-stack educational application designed to help CBSE Class 10 students get instant AI-powered answers to their academic questions. The platform allows students to submit questions by subject, receive detailed explanations with step-by-step solutions, and discover related topics for further learning. The application features a modern, responsive interface with subject-based navigation and intelligent question search capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React-based SPA**: Built with React 18 and TypeScript for type safety
- **Component Library**: Uses shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript
- **Route Organization**: Modular route registration with centralized error handling
- **Data Layer**: Abstract storage interface with in-memory implementation for development
- **AI Integration**: OpenAI GPT-5 integration for generating educational answers
- **Development Tools**: Vite integration for hot module replacement in development

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: 
  - Users table for basic authentication
  - Questions table with subject categorization and timestamps
  - Answers table with structured response fields (steps, related topics, quick answers)
- **Connection**: Neon Database serverless PostgreSQL for production deployment

### Authentication and Authorization
- **Session Management**: PostgreSQL session store with express-session
- **User Model**: Simple username/password authentication system
- **Security**: Environment-based configuration for database and API credentials

### External Service Integrations
- **OpenAI API**: GPT-5 model for generating educational content with structured JSON responses
- **AI Response Structure**: Standardized format including quick answers, step-by-step explanations, and related topic suggestions
- **Subject-Specific Tuning**: AI prompts tailored for CBSE Class 10 curriculum across 8 subjects (Mathematics, Physics, Chemistry, Biology, Geography, History, English, Hindi)

### Design Patterns
- **Repository Pattern**: Abstract storage interface allows for easy testing and database switching
- **Component Composition**: Reusable UI components with consistent prop interfaces
- **Error Boundaries**: Centralized error handling with user-friendly error displays
- **Responsive Design**: Mobile-first approach with grid-based layouts and adaptive navigation

### Build and Development
- **Build System**: Vite for frontend bundling with esbuild for server-side compilation
- **Development Environment**: Hot reload for both client and server code
- **Type Safety**: Shared TypeScript schemas between client and server
- **Path Aliases**: Clean import paths using TypeScript path mapping
