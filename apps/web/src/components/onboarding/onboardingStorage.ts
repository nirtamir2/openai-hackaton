const ONBOARDING_COMPANY_NAME_KEY = "signal-onboarding-company-name";
const ONBOARDING_PRODUCT_ID_KEY = "signal-onboarding-product-id";

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

export function saveOnboardingProductId({ productId }: { productId: string }) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(ONBOARDING_PRODUCT_ID_KEY, productId);
}

export function getOnboardingProductId() {
  if (typeof window === "undefined") {
    return "";
  }

  return sessionStorage.getItem(ONBOARDING_PRODUCT_ID_KEY) ?? "";
}
