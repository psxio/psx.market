import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { ServiceRequirement } from "@shared/schema";

interface RequirementsQuestionnaireProps {
  requirements: ServiceRequirement[];
  answers: Record<string, string>;
  onAnswerChange: (requirementId: string, answer: string) => void;
}

export function RequirementsQuestionnaire({
  requirements,
  answers,
  onAnswerChange,
}: RequirementsQuestionnaireProps) {
  if (requirements.length === 0) {
    return null;
  }

  const renderInput = (req: ServiceRequirement) => {
    const value = answers[req.id] || "";

    switch (req.type) {
      case "text":
        return (
          <Input
            id={req.id}
            value={value}
            onChange={(e) => onAnswerChange(req.id, e.target.value)}
            placeholder={req.placeholder || "Enter your answer..."}
            required={req.required}
            data-testid={`input-requirement-${req.id}`}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={req.id}
            value={value}
            onChange={(e) => onAnswerChange(req.id, e.target.value)}
            placeholder={req.placeholder || "Provide detailed information..."}
            required={req.required}
            rows={4}
            data-testid={`textarea-requirement-${req.id}`}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => onAnswerChange(req.id, val)}
            required={req.required}
          >
            <SelectTrigger data-testid={`select-requirement-${req.id}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {req.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => onAnswerChange(req.id, val)}
            required={req.required}
          >
            {req.options?.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <RadioGroupItem value={option} id={`${req.id}-${option}`} />
                <Label htmlFor={`${req.id}-${option}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        const checkedValues = value ? value.split(",") : [];
        return (
          <div className="space-y-2">
            {req.options?.map((option) => {
              const isChecked = checkedValues.includes(option);
              return (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={`${req.id}-${option}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...checkedValues, option]
                        : checkedValues.filter((v) => v !== option);
                      onAnswerChange(req.id, newValues.join(","));
                    }}
                  />
                  <Label htmlFor={`${req.id}-${option}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case "number":
        return (
          <Input
            id={req.id}
            type="number"
            value={value}
            onChange={(e) => onAnswerChange(req.id, e.target.value)}
            placeholder={req.placeholder || "Enter a number..."}
            required={req.required}
            data-testid={`input-number-${req.id}`}
          />
        );

      case "url":
        return (
          <Input
            id={req.id}
            type="url"
            value={value}
            onChange={(e) => onAnswerChange(req.id, e.target.value)}
            placeholder={req.placeholder || "https://example.com"}
            required={req.required}
            data-testid={`input-url-${req.id}`}
          />
        );

      default:
        return (
          <Input
            id={req.id}
            value={value}
            onChange={(e) => onAnswerChange(req.id, e.target.value)}
            placeholder={req.placeholder || "Enter your answer..."}
            required={req.required}
          />
        );
    }
  };

  const sortedRequirements = [...requirements].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Requirements</CardTitle>
        <CardDescription>
          Please provide the following information to help the builder deliver exactly what you need
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedRequirements.map((req) => (
          <div key={req.id} className="space-y-2" data-testid={`requirement-${req.id}`}>
            <Label htmlFor={req.id} className="flex items-center gap-2">
              {req.question}
              {req.required && (
                <Badge variant="outline" className="text-xs">
                  Required
                </Badge>
              )}
            </Label>
            {renderInput(req)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Common requirement templates for different service types
export const commonRequirements = {
  design: [
    { question: "What is your brand name?", type: "text", required: true, order: 1 },
    { question: "Do you have existing branding/guidelines?", type: "radio", options: ["Yes", "No"], required: true, order: 2 },
    { question: "Preferred color scheme", type: "text", required: false, order: 3 },
    { question: "Share reference/inspiration links", type: "textarea", placeholder: "Paste links to designs you like...", required: false, order: 4 },
  ],
  development: [
    { question: "Which blockchain?", type: "select", options: ["Ethereum", "Base", "Solana", "Polygon", "BSC"], required: true, order: 1 },
    { question: "Smart contract requirements", type: "textarea", required: true, order: 2 },
    { question: "Do you need an audit?", type: "radio", options: ["Yes", "No"], required: true, order: 3 },
    { question: "GitHub repository (if exists)", type: "url", required: false, order: 4 },
  ],
  kol: [
    { question: "Campaign objective", type: "select", options: ["Launch Awareness", "Community Growth", "Token Promotion", "Brand Partnership"], required: true, order: 1 },
    { question: "Target audience location", type: "text", required: true, order: 2 },
    { question: "Budget per KOL", type: "number", required: true, order: 3 },
    { question: "Campaign duration", type: "text", placeholder: "e.g., 1 week, 30 days", required: true, order: 4 },
  ],
  volume: [
    { question: "Target blockchain", type: "select", options: ["Ethereum", "Base", "Solana", "Polygon", "BSC"], required: true, order: 1 },
    { question: "Daily volume target (USD)", type: "number", required: true, order: 2 },
    { question: "Contract address", type: "text", required: true, order: 3 },
    { question: "Duration (days)", type: "number", required: true, order: 4 },
  ],
};
