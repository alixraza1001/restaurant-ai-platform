export function normalizeOptionalText(value: string | null | undefined): string | null {
  const normalized = value?.trim();

  return normalized === undefined || normalized.length === 0 ? null : normalized;
}

export function normalizeBranchCode(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeCurrency(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeCountryCode(value: string): string {
  return value.trim().toUpperCase();
}
