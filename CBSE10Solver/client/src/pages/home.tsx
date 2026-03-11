import { useState } from "react";
import Header from "@/components/header";
import SubjectSidebar from "@/components/subject-sidebar";
import QuestionInput from "@/components/question-input";
import SearchSection from "@/components/search-section";
import AnswerDisplay from "@/components/answer-display";
import SimilarQuestions from "@/components/similar-questions";
import { Subject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>("Mathematics");
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <SubjectSidebar
              selectedSubject={selectedSubject}
              onSubjectSelect={setSelectedSubject}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <QuestionInput
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              onQuestionSubmitted={setCurrentQuestionId}
            />

            <SearchSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onQuestionSelect={setCurrentQuestionId}
            />

            {currentQuestionId && (
              <AnswerDisplay questionId={currentQuestionId} />
            )}

            <SimilarQuestions 
              currentQuestionId={currentQuestionId}
              selectedSubject={selectedSubject}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
          data-testid="button-add-question-mobile"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
