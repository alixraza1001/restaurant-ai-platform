import {
  normalizeBranchCode,
  normalizeCountryCode,
  normalizeCurrency,
  normalizeOptionalText,
} from './normalization.js';
import { RestaurantDomainError } from './types.js';

export interface Coordinates {
  readonly latitude: number | null;
  readonly longitude: number | null;
}

function assertNonblankName(value: string, code: string, label: string): string {
  const normalized = normalizeOptionalText(value);
  if (normalized === null) {
    throw new RestaurantDomainError(code, `${label} is required.`);
  }

  return normalized;
}

export function assertValidRestaurantName(value: string): string {
  return assertNonblankName(value, 'restaurant.name_required', 'Restaurant name');
}

export function assertValidBranchName(value: string): string {
  return assertNonblankName(value, 'branch.name_required', 'Branch name');
}

export function assertValidBranchCode(value: string): string {
  const normalized = normalizeBranchCode(value);
  if (!/^[A-Z0-9_-]+$/.test(normalized)) {
    throw new RestaurantDomainError(
      'branch.code_invalid',
      'Branch Code may contain only letters, digits, underscores, and hyphens.',
    );
  }

  return normalized;
}

export function assertValidTimezone(value: string): string {
  try {
    const timeZone = new Intl.DateTimeFormat('en', { timeZone: value }).resolvedOptions().timeZone;
    if (timeZone !== value) {
      throw new RangeError('Timezone is not canonical.');
    }
  } catch {
    throw new RestaurantDomainError(
      'regional.timezone_invalid',
      'Timezone must be a canonical IANA identifier.',
    );
  }

  return value;
}

export function assertValidCurrency(value: string): string {
  const normalized = normalizeCurrency(value);
  if (!/^[A-Z]{3}$/.test(normalized)) {
    throw new RestaurantDomainError(
      'regional.currency_invalid',
      'Currency must be an ISO 4217 code.',
    );
  }

  try {
    new Intl.NumberFormat('en', { currency: normalized, style: 'currency' });
  } catch {
    throw new RestaurantDomainError(
      'regional.currency_invalid',
      'Currency must be an ISO 4217 code.',
    );
  }

  return normalized;
}

export function assertValidLocale(value: string): string {
  try {
    const [canonical] = Intl.getCanonicalLocales(value);
    if (canonical === undefined || canonical !== value) {
      throw new RangeError('Locale is not canonical.');
    }
  } catch {
    throw new RestaurantDomainError(
      'regional.locale_invalid',
      'Locale must be a canonical BCP 47-style locale identifier.',
    );
  }

  return value;
}

export function assertValidCountryCode(value: string): string {
  const normalized = normalizeCountryCode(value);
  const displayName = /^[A-Z]{2}$/.test(normalized)
    ? new Intl.DisplayNames('en', { fallback: 'none', type: 'region' }).of(normalized)
    : undefined;

  if (displayName === undefined || displayName === 'Unknown Region') {
    throw new RestaurantDomainError(
      'address.country_code_invalid',
      'Country code must be an ISO 3166-1 alpha-2 code.',
    );
  }

  return normalized;
}

export function assertValidCoordinates({ latitude, longitude }: Coordinates): void {
  if ((latitude === null) !== (longitude === null)) {
    throw new RestaurantDomainError(
      'branch.coordinates_pair_required',
      'Latitude and longitude must either both be supplied or both be null.',
    );
  }

  if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) {
    throw new RestaurantDomainError(
      'branch.latitude_invalid',
      'Latitude must be between -90 and 90.',
    );
  }

  if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) {
    throw new RestaurantDomainError(
      'branch.longitude_invalid',
      'Longitude must be between -180 and 180.',
    );
  }
}
