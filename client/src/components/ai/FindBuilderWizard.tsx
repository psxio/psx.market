import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BuilderCard } from "@/components/builder-card";
import { Loader2, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Builder, Service } from "@shared/schema";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "text" | "number";
  options?: string[];
}

interface BuilderScore {
  builder: Builder;
  score: number;
  reasoning: string;
  matchedSkills: string[];
  services?: Service[];
}

interface MatchResults {
  topMatches: BuilderScore[];
  alternativeMatches: BuilderScore[];
  insights: string;
}

export function FindBuilderWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);

  const { data: questions, isLoading: questionsLoading } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/ai/quiz-questions"],
    queryFn: async () => {
      const res = await fetch("/api/ai/quiz-questions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load questions");
      return res.json();
    },
  });

  const matchMutation = useMutation({
    mutationFn: async (criteria: any): Promise<MatchResults> => {
      const res = await fetch("/api/ai/match-builders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(criteria),
      });
      if (!res.ok) throw new Error("Failed to match builders");
      return res.json();
    },
    onSuccess: () => {
      setShowResults(true);
    },
  });

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (questions && step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const criteria = {
      projectDescription: answers.projectDescription || "",
      category: answers.category || "",
      budget: answers.budget || "",
      timeline: answers.timeline || "",
      requirements: Object.values(answers).filter((v) => typeof v === "string" && v),
      technicalNeeds: answers.technicalNeeds?.split(",").map((s: string) => s.trim()) || [],
    };

    matchMutation.mutate(criteria);
  };

  if (questionsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (showResults && matchMutation.data) {
    const { topMatches, alternativeMatches, insights } = matchMutation.data;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <CardTitle>Your Perfect Matches</CardTitle>
            </div>
            <CardDescription>{insights}</CardDescription>
          </CardHeader>
        </Card>

        {topMatches.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMatches.map((match: BuilderScore) => (
                <div key={match.builder.id} className="relative">
                  <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-purple-500 to-cyan-500">
                    {match.score}% Match
                  </Badge>
                  <BuilderCard builder={match.builder} />
                  <Card className="mt-2">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-2">{match.reasoning}</p>
                      {match.matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {match.matchedSkills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {alternativeMatches.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Alternative Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {alternativeMatches.map((match: BuilderScore) => (
                <div key={match.builder.id} className="relative">
                  <Badge className="absolute -top-2 -right-2 z-10" variant="outline">
                    {match.score}%
                  </Badge>
                  <BuilderCard builder={match.builder} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={() => {
              setShowResults(false);
              setStep(0);
              setAnswers({});
            }}
            variant="outline"
            data-testid="button-restart-quiz"
          >
            Start New Search
          </Button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Unable to load quiz questions. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[step];
  
  // Extra safety check - if currentQuestion is somehow undefined, show error
  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Error loading question. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }
  
  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = step === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">
              Question {step + 1} of {questions.length}
            </Badge>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <RadioGroup
              value={currentAnswer || ""}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`${currentQuestion.id}-${option}`}
                      data-testid={`radio-option-${option.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label
                      htmlFor={`${currentQuestion.id}-${option}`}
                      className="flex-1 cursor-pointer p-3 rounded-md hover-elevate"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {currentQuestion.type === "text" && (
            <div className="space-y-2">
              <Textarea
                value={currentAnswer || ""}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer..."
                rows={4}
                data-testid="textarea-answer"
              />
            </div>
          )}

          {currentQuestion.type === "number" && (
            <div className="space-y-2">
              <Input
                type="text"
                value={currentAnswer || ""}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder="Enter amount..."
                data-testid="input-answer"
              />
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={step === 0}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentAnswer || matchMutation.isPending}
              data-testid="button-next"
            >
              {matchMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finding Matches...
                </>
              ) : isLastQuestion ? (
                <>
                  Find My Builders
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
