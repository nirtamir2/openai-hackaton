import { useForm } from "@tanstack/react-form";
import { clsx } from "clsx";
import { ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import type { CompanyAnalysis } from "@app-template/api/schemas/companyAnalysis";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

interface Props {
  companyName: string;
  questions: CompanyAnalysis["onboardingQuestions"];
}

export function OnboardingQuestions({ companyName, questions }: Props) {
  const form = useForm({
    defaultValues: {
      targetMarkets: [] as Array<string>,
      personalityAndTone: "",
    },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-8 sm:py-14">
      <header className="flex flex-col gap-3 text-center">
        <div className="mx-auto grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Brief approved · Final step
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Make the strategy sound like {companyName}
        </h2>
        <p className="mx-auto max-w-2xl text-sm/6 text-muted-foreground">
          These answers add the human context that a website alone can’t provide.
        </p>
      </header>

      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="targetMarkets">
          {(field) => (
            <fieldset className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-1">
                <legend className="text-lg font-semibold">{questions.targetMarket.question}</legend>
                <p className="text-sm text-muted-foreground">Select all that apply.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {questions.targetMarket.options.map((option) => {
                  const isSelected = field.state.value.includes(option);
                  return (
                    <label
                      key={option}
                      className={clsx(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-[border-color,background-color,box-shadow]",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "bg-background hover:bg-accent",
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          field.handleChange(
                            updateTargetMarkets({
                              currentTargetMarkets: field.state.value,
                              option,
                              checked,
                            }),
                          );
                        }}
                      />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </form.Field>

        <form.Field name="personalityAndTone">
          {(field) => (
            <fieldset className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-1">
                <legend className="text-lg font-semibold">
                  {questions.personalityAndTone.question}
                </legend>
                <p className="text-sm text-muted-foreground">Choose one primary voice.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {questions.personalityAndTone.options.map((option) => {
                  const isSelected = field.state.value === option;
                  return (
                    <label
                      key={option}
                      className={clsx(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-[border-color,background-color,box-shadow]",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "bg-background hover:bg-accent",
                      )}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option}
                        checked={isSelected}
                        onBlur={field.handleBlur}
                        onChange={() => {
                          field.handleChange(option);
                        }}
                        className="peer sr-only"
                      />
                      <span className="grid size-4 shrink-0 place-items-center rounded-full border border-input peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
                        <span
                          className={clsx(
                            "size-2 rounded-full bg-primary transition-transform",
                            isSelected ? "scale-100" : "scale-0",
                          )}
                        />
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.values, state.isSubmitting] as const}>
          {([values, isSubmitting]) => {
            const canSubmit =
              values.targetMarkets.length > 0 && values.personalityAndTone.length > 0;
            return (
              <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-primary p-4 text-primary-foreground sm:flex-row">
                <p className="flex items-center gap-2 text-sm">
                  {canSubmit ? <Check className="size-4" /> : null}
                  {canSubmit
                    ? "Ready to build your custom plan"
                    : "Answer both questions to continue"}
                </p>
                <Button type="submit" variant="secondary" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                  {isSubmitting ? "Building your plan" : "Create marketing plan"}
                  {isSubmitting ? null : <ArrowRight />}
                </Button>
              </div>
            );
          }}
        </form.Subscribe>
      </form>
    </div>
  );
}

interface UpdateTargetMarketsProps {
  currentTargetMarkets: Array<string>;
  option: string;
  checked: boolean;
}

function updateTargetMarkets({ currentTargetMarkets, option, checked }: UpdateTargetMarketsProps) {
  return checked
    ? [...currentTargetMarkets, option]
    : currentTargetMarkets.filter((item) => item !== option);
}
