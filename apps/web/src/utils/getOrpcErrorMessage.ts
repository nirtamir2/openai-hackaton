function formatValidationIssues({ issues }: { issues: Array<{ path?: Array<string | number>; message?: string }> }) {
  const formattedIssues = issues
    .map((issue) => {
      const fieldPath = issue.path?.join(".") ?? "input";
      return issue.message != null && issue.message.length > 0
        ? `${fieldPath}: ${issue.message}`
        : fieldPath;
    })
    .filter((issue) => issue.length > 0);

  if (formattedIssues.length === 0) {
    return "Input validation failed.";
  }

  return formattedIssues.join(" ");
}

export function getOrpcErrorMessage({ error }: { error: unknown }) {
  if (typeof error === "object" && error != null) {
    const errorObject = error as {
      message?: string;
      data?: {
        issues?: Array<{ path?: Array<string | number>; message?: string }>;
      };
    };

    if (errorObject.data?.issues != null && errorObject.data.issues.length > 0) {
      return formatValidationIssues({ issues: errorObject.data.issues });
    }

    if (errorObject.message != null && errorObject.message.length > 0) {
      return errorObject.message;
    }
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
