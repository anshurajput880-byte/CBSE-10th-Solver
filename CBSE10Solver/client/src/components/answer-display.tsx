import { useQuery } from "@tanstack/react-query";
import { Bookmark, Share, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AnswerDisplayProps {
  questionId: string;
}

interface QuestionWithAnswer {
  question: {
    id: string;
    question: string;
    subject: string;
    createdAt?: Date;
  };
  answer?: {
    id: string;
    answer: string;
    quickAnswer?: string;
    steps?: string[];
    relatedTopics?: string[];
  };
}

export default function AnswerDisplay({ questionId }: AnswerDisplayProps) {
  const { data, isLoading, error } = useQuery<QuestionWithAnswer>({
    queryKey: ["/api/questions", questionId],
    enabled: !!questionId,
  });

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <p className="text-muted-foreground">Failed to load answer. Please try again.</p>
      </div>
    );
  }

  const { question, answer } = data;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Question: {question.question}
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {question.subject}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {question.createdAt 
                ? `${Math.floor((Date.now() - new Date(question.createdAt).getTime()) / (1000 * 60))} minutes ago`
                : 'Just now'
              }
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            data-testid="button-bookmark-answer"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            data-testid="button-share-answer"
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {answer && (
        <div className="space-y-6">
          {/* Quick Answer */}
          {answer.quickAnswer && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Quick Answer</h4>
              <p className="text-foreground">{answer.quickAnswer}</p>
            </div>
          )}

          {/* Step-by-step Solution */}
          {answer.steps && answer.steps.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-4">Step-by-step Solution</h4>
              <div className="steps-container space-y-4 counter-reset-steps">
                {answer.steps.map((step, index) => (
                  <div key={index} className="answer-step flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Answer */}
          {answer.answer && (
            <div>
              <h4 className="font-semibold text-foreground mb-3">Detailed Explanation</h4>
              <div className="prose prose-sm max-w-none text-foreground">
                {answer.answer.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Related Topics */}
          {answer.relatedTopics && answer.relatedTopics.length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-foreground mb-3">Related Topics</h4>
              <div className="flex flex-wrap gap-2">
                {answer.relatedTopics.map((topic, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
                    data-testid={`related-topic-${index}`}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Was this helpful?</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground hover:text-green-600"
                    data-testid="button-thumbs-up"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">24</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground hover:text-red-600"
                    data-testid="button-thumbs-down"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    <span className="text-sm">2</span>
                  </Button>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary hover:text-primary/80"
                data-testid="button-follow-up"
              >
                Ask follow-up question
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
