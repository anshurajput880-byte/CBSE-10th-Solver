import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Question } from "@shared/schema";

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuestionSelect: (questionId: string) => void;
}

const recentSearchTerms = ["Quadratic equations", "Photosynthesis process", "French Revolution"];

export default function SearchSection({ searchQuery, onSearchChange, onQuestionSelect }: SearchSectionProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const { data: searchResults } = useQuery<Question[]>({
    queryKey: ["/api/search", { q: searchQuery }],
    enabled: searchQuery.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localQuery);
  };

  const handleRecentSearchClick = (term: string) => {
    setLocalQuery(term);
    onSearchChange(term);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Search Previous Questions</h3>
      
      <form onSubmit={handleSearch} className="relative mb-4">
        <Input
          type="text"
          placeholder="Search for similar questions..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      </form>

      {/* Search Results */}
      {searchResults && searchResults.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Search Results</h4>
          <div className="space-y-2">
            {searchResults.slice(0, 5).map((question) => (
              <div
                key={question.id}
                className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => onQuestionSelect(question.id)}
                data-testid={`search-result-${question.id}`}
              >
                <p className="font-medium text-foreground line-clamp-2">{question.question}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">{question.subject}</span>
                  <span className="text-sm text-muted-foreground">
                    {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</h4>
        <div className="flex flex-wrap gap-2">
          {recentSearchTerms.map((term) => (
            <Badge
              key={term}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => handleRecentSearchClick(term)}
              data-testid={`recent-search-${term.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {term}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
