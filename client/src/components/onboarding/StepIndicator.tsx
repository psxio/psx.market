import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
  completed: boolean;
  current: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                  ${step.completed ? "bg-chart-3 text-white" : ""}
                  ${step.current ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : ""}
                  ${!step.current && !step.completed ? "bg-muted text-muted-foreground" : ""}
                `}
                data-testid={`step-indicator-${step.number}`}
              >
                {step.completed ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span className={`
                mt-2 text-xs font-medium text-center absolute top-12 whitespace-nowrap
                ${step.current ? "text-foreground" : "text-muted-foreground"}
              `}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2">
                <div className={`
                  h-full transition-all
                  ${step.completed ? "bg-chart-3" : "bg-muted"}
                `} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
