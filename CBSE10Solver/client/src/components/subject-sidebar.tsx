import { Subject, subjects } from "@shared/schema";
import { Calculator, Atom, FlaskConical, Dna, Globe, Landmark, Book, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectSidebarProps {
  selectedSubject: Subject;
  onSubjectSelect: (subject: Subject) => void;
}

const subjectIcons = {
  Mathematics: Calculator,
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Dna,
  Geography: Globe,
  History: Landmark,
  English: Book,
  Hindi: Languages,
};

export default function SubjectSidebar({ selectedSubject, onSubjectSelect }: SubjectSidebarProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-foreground mb-4">Subjects</h3>
      <div className="space-y-2">
        {subjects.map((subject) => {
          const Icon = subjectIcons[subject];
          const isSelected = selectedSubject === subject;
          
          return (
            <div
              key={subject}
              className={cn(
                "rounded-lg p-3 cursor-pointer transition-all hover:transform hover:-translate-y-0.5",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-secondary hover:text-secondary-foreground"
              )}
              onClick={() => onSubjectSelect(subject)}
              data-testid={`subject-${subject.toLowerCase()}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{subject}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
