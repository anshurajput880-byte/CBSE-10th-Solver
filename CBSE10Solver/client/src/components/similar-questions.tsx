import { useQuery, useMutation } from "@tanstack/react-query";
import { Question, Subject } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface SimilarQuestionsProps {
  currentQuestionId: string | null;
  selectedSubject: Subject;
}

export default function SimilarQuestions({ currentQuestionId, selectedSubject }: SimilarQuestionsProps) {
  // Get questions from the same subject
  const { data: subjectQuestions } = useQuery<Question[]>({
    queryKey: ["/api/questions/subject", selectedSubject],
    enabled: !!selectedSubject,
  });

  // Filter out the current question and get recent ones
  const similarQuestions = subjectQuestions?.filter(q => q.id !== currentQuestionId).slice(0, 3) || [];

  if (similarQuestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Similar Questions</h3>
      <div className="space-y-3">
        {similarQuestions.map((question) => (
          <div
            key={question.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            data-testid={`similar-question-${question.id}`}
          >
            <p className="font-medium text-foreground mb-2 line-clamp-2">
              {question.question}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{question.subject}</span>
              <span>
                {question.createdAt 
                  ? new Date(question.createdAt).toLocaleDateString()
                  : 'Recent'
                }
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
