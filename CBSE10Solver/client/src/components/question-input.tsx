import { useState } from "react";
import { Subject, subjects } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuestionInputProps {
  selectedSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
  onQuestionSubmitted: (questionId: string) => void;
}

export default function QuestionInput({ 
  selectedSubject, 
  onSubjectChange, 
  onQuestionSubmitted 
}: QuestionInputProps) {
  const [question, setQuestion] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitQuestionMutation = useMutation({
    mutationFn: async (data: { question: string; subject: string }) => {
      const response = await apiRequest("POST", "/api/questions", data);
      return response.json();
    },
    onSuccess: (data) => {
      onQuestionSubmitted(data.question.id);
      setQuestion("");
      toast({
        title: "Question submitted successfully!",
        description: "Your answer has been generated.",
      });
      // Invalidate queries to refresh question lists
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
    },
    onError: (error) => {
      let title = "Error submitting question";
      let description = "Please try again.";
      
      if (error instanceof Error) {
        // API errors come in format "status: response body"
        const errorMessage = error.message;
        
        // Check for specific error patterns
        if (errorMessage.includes("429:") || errorMessage.includes("quota")) {
          title = "OpenAI Quota Exceeded";
          description = "You've reached your OpenAI API limit. Please add billing details at https://platform.openai.com/settings/billing";
        } else if (errorMessage.includes("401:") || errorMessage.includes("invalid")) {
          title = "API Configuration Error";
          description = "Your OpenAI API key is invalid. Please check your configuration.";
        } else if (errorMessage.includes("503:") || errorMessage.includes("service")) {
          title = "Service Temporarily Unavailable";
          description = "OpenAI service is down. Please try again in a few minutes.";
        } else {
          // Try to extract the JSON message from the error
          try {
            const statusIndex = errorMessage.indexOf(": ");
            if (statusIndex !== -1) {
              const responseBody = errorMessage.substring(statusIndex + 2);
              const errorData = JSON.parse(responseBody);
              description = errorData.message || errorMessage;
            } else {
              description = errorMessage;
            }
          } catch {
            description = errorMessage;
          }
        }
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitQuestionMutation.mutate({
      question: question.trim(),
      subject: selectedSubject,
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Ask Your Question</h2>
      
      {/* Subject Selector */}
      <div className="mb-4">
        <Label htmlFor="subject-select" className="block text-sm font-medium text-foreground mb-2">
          Select Subject
        </Label>
        <Select value={selectedSubject} onValueChange={(value) => onSubjectChange(value as Subject)}>
          <SelectTrigger 
            id="subject-select"
            className="w-full"
            data-testid="select-subject"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Question Input */}
      <div className="mb-4">
        <Label htmlFor="question-input" className="block text-sm font-medium text-foreground mb-2">
          Your Question
        </Label>
        <Textarea
          id="question-input"
          placeholder="Type your CBSE Class 10 question here... For example: 'Solve the quadratic equation x² + 5x + 6 = 0'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="resize-none"
          rows={4}
          data-testid="textarea-question"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          data-testid="button-add-image"
        >
          <Image className="h-4 w-4" />
          <span>Add Image</span>
        </Button>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            data-testid="button-save-draft"
          >
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitQuestionMutation.isPending}
            data-testid="button-get-answer"
          >
            {submitQuestionMutation.isPending ? "Generating..." : "Get Answer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
