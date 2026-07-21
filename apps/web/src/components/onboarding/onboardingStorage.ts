const ONBOARDING_COMPANY_NAME_KEY = "signal-onboarding-company-name";

export function saveOnboardingCompanyName({ companyName }: { companyName: string }) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(ONBOARDING_COMPANY_NAME_KEY, companyName);
}

export function getOnboardingCompanyName() {
  if (typeof window === "undefined") {
    return "";
  }

  return sessionStorage.getItem(ONBOARDING_COMPANY_NAME_KEY) ?? "";
}
