import type * as React from "react";

interface Props {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, error, helperText, children }: Props) {
  function renderAdditionalText() {
    if (error != null && error.length > 0) {
      return <p className="text-sm text-destructive">{error}</p>;
    }

    return helperText != null && helperText.length > 0 ? (
      <p className="text-sm text-muted-foreground">{helperText}</p>
    ) : null;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {label != null && label.length > 0 ? (
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      {children}
      {renderAdditionalText()}
    </div>
  );
}
