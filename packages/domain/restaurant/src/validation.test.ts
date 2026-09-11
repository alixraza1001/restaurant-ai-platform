import { describe, expect, test } from 'vitest';

import {
  RestaurantDomainError,
  assertValidBranchCode,
  assertValidBranchName,
  assertValidCoordinates,
  assertValidCountryCode,
  assertValidCurrency,
  assertValidLocale,
  assertValidRestaurantName,
  assertValidTimezone,
} from './index.ts';

function expectDomainError(action: () => void, code: string): void {
  expect(action).toThrowError(
    expect.objectContaining<Partial<RestaurantDomainError>>({
      code,
    }),
  );
}

describe('Restaurant/Branch validation', () => {
  test('accepts nonblank Restaurant and Branch names', () => {
    expect(assertValidRestaurantName('Café One')).toBe('Café One');
    expect(assertValidBranchName('DHA Phase 6')).toBe('DHA Phase 6');
  });

  test('rejects blank Restaurant and Branch names', () => {
    expectDomainError(() => assertValidRestaurantName('  '), 'restaurant.name_required');
    expectDomainError(() => assertValidBranchName('\t'), 'branch.name_required');
  });

  test('accepts only normalized Branch Code characters', () => {
    expect(assertValidBranchCode('CLIFTON-1_A')).toBe('CLIFTON-1_A');
    expectDomainError(() => assertValidBranchCode('Clifton 1'), 'branch.code_invalid');
  });

  test('validates timezone, currency, locale, and country standards', () => {
    expect(assertValidTimezone('Asia/Karachi')).toBe('Asia/Karachi');
    expect(assertValidCurrency('PKR')).toBe('PKR');
    expect(assertValidLocale('en-PK')).toBe('en-PK');
    expect(assertValidCountryCode('PK')).toBe('PK');

    expectDomainError(() => assertValidTimezone('Mars/Olympus_Mons'), 'regional.timezone_invalid');
    expectDomainError(() => assertValidCurrency('PK'), 'regional.currency_invalid');
    expectDomainError(() => assertValidLocale('not_a_locale'), 'regional.locale_invalid');
    expectDomainError(() => assertValidCountryCode('PAK'), 'address.country_code_invalid');
    expectDomainError(() => assertValidCountryCode('ZZ'), 'address.country_code_invalid');
  });

  test('requires coordinates together and within their respective ranges', () => {
    expect(() => assertValidCoordinates({ latitude: 24.8607, longitude: 67.0011 })).not.toThrow();

    expectDomainError(
      () => assertValidCoordinates({ latitude: 24.8607, longitude: null }),
      'branch.coordinates_pair_required',
    );
    expectDomainError(
      () => assertValidCoordinates({ latitude: 91, longitude: 67 }),
      'branch.latitude_invalid',
    );
    expectDomainError(
      () => assertValidCoordinates({ latitude: 24, longitude: 181 }),
      'branch.longitude_invalid',
    );
  });
});
