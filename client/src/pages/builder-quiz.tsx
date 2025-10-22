import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    points: {
      kols: number;
      "3d-content": number;
      marketing: number;
      development: number;
      volume: number;
    };
  }>;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "experience",
    question: "How much professional experience do you have in Web3?",
    options: [
      {
        value: "none",
        label: "Just getting started",
        points: { kols: 0, "3d-content": 0, marketing: 0, development: 0, volume: 0 },
      },
      {
        value: "beginner",
        label: "6 months - 1 year",
        points: { kols: 1, "3d-content": 1, marketing: 1, development: 1, volume: 1 },
      },
      {
        value: "intermediate",
        label: "1-3 years",
        points: { kols: 2, "3d-content": 2, marketing: 2, development: 2, volume: 2 },
      },
      {
        value: "expert",
        label: "3+ years",
        points: { kols: 3, "3d-content": 3, marketing: 3, development: 3, volume: 3 },
      },
    ],
  },
  {
    id: "skills",
    question: "Which best describes your primary skillset?",
    options: [
      {
        value: "social",
        label: "Social media influence and community building",
        points: { kols: 5, "3d-content": 0, marketing: 3, development: 0, volume: 0 },
      },
      {
        value: "creative",
        label: "3D design, animation, and visual content",
        points: { kols: 0, "3d-content": 5, marketing: 1, development: 0, volume: 0 },
      },
      {
        value: "marketing",
        label: "Marketing strategy and growth hacking",
        points: { kols: 2, "3d-content": 0, marketing: 5, development: 0, volume: 1 },
      },
      {
        value: "technical",
        label: "Smart contracts and blockchain development",
        points: { kols: 0, "3d-content": 0, marketing: 0, development: 5, volume: 2 },
      },
      {
        value: "trading",
        label: "Trading, market making, and volume generation",
        points: { kols: 0, "3d-content": 0, marketing: 1, development: 1, volume: 5 },
      },
    ],
  },
  {
    id: "audience",
    question: "Do you have an established audience or client base?",
    options: [
      {
        value: "none",
        label: "No, I'm building from scratch",
        points: { kols: 0, "3d-content": 1, marketing: 1, development: 1, volume: 1 },
      },
      {
        value: "small",
        label: "Yes, small following (< 1,000)",
        points: { kols: 1, "3d-content": 2, marketing: 2, development: 2, volume: 2 },
      },
      {
        value: "medium",
        label: "Yes, growing following (1,000 - 10,000)",
        points: { kols: 3, "3d-content": 2, marketing: 3, development: 2, volume: 2 },
      },
      {
        value: "large",
        label: "Yes, large following (10,000+)",
        points: { kols: 5, "3d-content": 3, marketing: 4, development: 3, volume: 3 },
      },
    ],
  },
  {
    id: "availability",
    question: "How much time can you dedicate per week?",
    options: [
      {
        value: "part-time",
        label: "Less than 10 hours (side hustle)",
        points: { kols: 1, "3d-content": 1, marketing: 1, development: 1, volume: 1 },
      },
      {
        value: "regular",
        label: "10-20 hours (part-time)",
        points: { kols: 2, "3d-content": 2, marketing: 2, development: 2, volume: 2 },
      },
      {
        value: "full-time",
        label: "20-40 hours (full-time)",
        points: { kols: 3, "3d-content": 3, marketing: 3, development: 3, volume: 3 },
      },
      {
        value: "unlimited",
        label: "40+ hours (dedicated professional)",
        points: { kols: 4, "3d-content": 4, marketing: 4, development: 4, volume: 4 },
      },
    ],
  },
  {
    id: "portfolio",
    question: "Do you have a portfolio of previous work?",
    options: [
      {
        value: "none",
        label: "No portfolio yet",
        points: { kols: 0, "3d-content": 0, marketing: 0, development: 0, volume: 0 },
      },
      {
        value: "basic",
        label: "A few examples (1-3 projects)",
        points: { kols: 1, "3d-content": 2, marketing: 2, development: 2, volume: 1 },
      },
      {
        value: "good",
        label: "Solid portfolio (4-10 projects)",
        points: { kols: 2, "3d-content": 3, marketing: 3, development: 3, volume: 2 },
      },
      {
        value: "extensive",
        label: "Extensive portfolio (10+ projects)",
        points: { kols: 3, "3d-content": 4, marketing: 4, development: 4, volume: 3 },
      },
    ],
  },
];

export default function BuilderQuiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [quizQuestions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const scores = {
      kols: 0,
      "3d-content": 0,
      marketing: 0,
      development: 0,
      volume: 0,
    };

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = quizQuestions.find((q) => q.id === questionId);
      const option = question?.options.find((o) => o.value === answer);
      if (option) {
        Object.keys(scores).forEach((category) => {
          scores[category as keyof typeof scores] += option.points[category as keyof typeof option.points];
        });
      }
    });

    return scores;
  };

  const getRecommendation = () => {
    const scores = calculateResults();
    const maxScore = Math.max(...Object.values(scores));
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    
    const topCategory = Object.entries(scores).find(
      ([_, score]) => score === maxScore
    )?.[0];

    const categoryNames = {
      kols: "KOL & Influencer",
      "3d-content": "3D Content Creator",
      marketing: "Marketing & Growth",
      development: "Smart Contract Developer",
      volume: "Volume Services",
    };

    const categoryDescriptions = {
      kols: "You have strong social presence and community building skills. Perfect for influencer campaigns and brand partnerships.",
      "3d-content": "Your creative and technical skills in 3D design make you ideal for visual content creation projects.",
      marketing: "Your strategic thinking and growth expertise are perfect for helping Web3 projects scale.",
      development: "Your technical blockchain skills are in high demand for smart contract and dApp development.",
      volume: "Your trading expertise and market knowledge are valuable for liquidity and volume services.",
    };

    const readinessLevel = totalScore >= 12 ? "ready" : totalScore >= 8 ? "almost" : "early";

    return {
      category: topCategory as keyof typeof categoryNames,
      categoryName: categoryNames[topCategory as keyof typeof categoryNames],
      description: categoryDescriptions[topCategory as keyof typeof categoryDescriptions],
      score: maxScore,
      totalScore,
      readinessLevel,
      scores,
    };
  };

  if (showResults) {
    const result = getRecommendation();

    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {result.readinessLevel === "ready" ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                ) : result.readinessLevel === "almost" ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                    <AlertCircle className="h-10 w-10 text-yellow-500" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                    <Sparkles className="h-10 w-10 text-blue-500" />
                  </div>
                )}
              </div>
              <CardTitle className="text-3xl">Your Results</CardTitle>
              <CardDescription className="text-lg mt-2">
                {result.readinessLevel === "ready"
                  ? "You're ready to start earning!"
                  : result.readinessLevel === "almost"
                  ? "You're almost there!"
                  : "Keep building your skills!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recommended Category</p>
                    <h3 className="text-2xl font-bold">{result.categoryName}</h3>
                  </div>
                  <Badge className="text-lg px-4 py-2" data-testid="badge-score">
                    {result.score}/20
                  </Badge>
                </div>
                <p className="text-muted-foreground">{result.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Your Category Scores</h4>
                {Object.entries(result.scores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, score]) => {
                    const categoryNames = {
                      kols: "KOL & Influencer",
                      "3d-content": "3D Creator",
                      marketing: "Marketing",
                      development: "Development",
                      volume: "Volume Services",
                    };
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{categoryNames[category as keyof typeof categoryNames]}</span>
                          <span className="font-bold">{score}/20</span>
                        </div>
                        <Progress value={(score / 20) * 100} />
                      </div>
                    );
                  })}
              </div>

              {result.readinessLevel === "ready" && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="font-semibold">You're Ready to Apply!</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on your answers, you have the experience and skills to succeed on Create.psx. Apply now to start earning!
                  </p>
                  <Link href="/builder-onboarding">
                    <Button className="w-full gap-2" size="lg" data-testid="button-apply-now">
                      <Award className="h-5 w-5" />
                      Start Application
                    </Button>
                  </Link>
                </div>
              )}

              {result.readinessLevel === "almost" && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <p className="font-semibold">Almost There!</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You're on the right track! Consider building a few more projects for your portfolio, then come back and apply.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/builders">
                      <Button variant="outline" className="w-full" data-testid="button-learn-more">
                        Learn More
                      </Button>
                    </Link>
                    <Link href="/builder-onboarding">
                      <Button className="w-full" data-testid="button-apply-anyway">
                        Apply Anyway
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {result.readinessLevel === "early" && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    <p className="font-semibold">Keep Building!</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You're just getting started! Focus on building your skills and portfolio. Check out our resources to accelerate your growth.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/builders">
                      <Button variant="outline" className="w-full" data-testid="button-view-resources">
                        <Target className="h-4 w-4 mr-2" />
                        View Resources
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowResults(false);
                        setCurrentQuestion(0);
                        setAnswers({});
                      }}
                      data-testid="button-retake-quiz"
                    >
                      Retake Quiz
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Link href="/builders">
                  <Button variant="ghost" className="w-full" data-testid="button-back-home">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Builders Page
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8 text-center">
          <Link href="/builders">
            <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Builder Readiness Assessment</h1>
          <p className="text-muted-foreground">
            Answer 5 quick questions to find your perfect category
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors hover-elevate ${
                      selectedAnswer === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    data-testid={`option-${option.value}`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <span className="flex-1">{option.label}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-4">
              {currentQuestion > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2"
                  data-testid="button-previous"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              <Button
                className="flex-1 gap-2"
                onClick={handleNext}
                disabled={!selectedAnswer}
                data-testid="button-next"
              >
                {currentQuestion === quizQuestions.length - 1 ? "See Results" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
