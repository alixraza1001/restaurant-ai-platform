import { describe, expect, test } from 'vitest';

import {
  normalizeBranchCode,
  normalizeCountryCode,
  normalizeCurrency,
  normalizeOptionalText,
} from './index.ts';

describe('Restaurant/Branch normalization', () => {
  test('normalizes operational identifiers into their canonical form', () => {
    expect(normalizeBranchCode('  Clifton-1 ')).toBe('CLIFTON-1');
    expect(normalizeCurrency('pkr')).toBe('PKR');
    expect(normalizeCountryCode('pk')).toBe('PK');
  });

  test('normalizes blank optional text to null', () => {
    expect(normalizeOptionalText('   ')).toBeNull();
    expect(normalizeOptionalText('\tvalue\n')).toBe('value');
  });
});
