import { describe, expect, test } from 'vitest';

import { resolveEffectiveBranchConfiguration } from './index.ts';

const configuredDefaults = {
  currency: 'PKR',
  deliveryEnabled: true,
  locale: 'en-PK',
  pickupEnabled: true,
  timezone: 'Asia/Karachi',
};

const inheritingOverrides = {
  currency: null,
  deliveryEnabled: null,
  locale: null,
  pickupEnabled: null,
  timezone: null,
};

describe('effective Branch configuration', () => {
  test('inherits Restaurant defaults when Branch overrides are null', () => {
    expect(resolveEffectiveBranchConfiguration(configuredDefaults, inheritingOverrides)).toEqual({
      currency: { source: 'restaurant_default', value: 'PKR' },
      deliveryEnabled: { source: 'restaurant_default', value: true },
      locale: { source: 'restaurant_default', value: 'en-PK' },
      pickupEnabled: { source: 'restaurant_default', value: true },
      timezone: { source: 'restaurant_default', value: 'Asia/Karachi' },
    });
  });

  test('uses explicit Branch overrides, including false capability overrides', () => {
    expect(
      resolveEffectiveBranchConfiguration(configuredDefaults, {
        currency: 'USD',
        deliveryEnabled: false,
        locale: 'en-US',
        pickupEnabled: false,
        timezone: 'America/New_York',
      }),
    ).toEqual({
      currency: { source: 'branch_override', value: 'USD' },
      deliveryEnabled: { source: 'branch_override', value: false },
      locale: { source: 'branch_override', value: 'en-US' },
      pickupEnabled: { source: 'branch_override', value: false },
      timezone: { source: 'branch_override', value: 'America/New_York' },
    });
  });

  test('reports unset where neither defaults nor overrides exist', () => {
    expect(
      resolveEffectiveBranchConfiguration(
        {
          currency: null,
          deliveryEnabled: null,
          locale: null,
          pickupEnabled: null,
          timezone: null,
        },
        inheritingOverrides,
      ),
    ).toEqual({
      currency: { source: 'unset', value: null },
      deliveryEnabled: { source: 'unset', value: null },
      locale: { source: 'unset', value: null },
      pickupEnabled: { source: 'unset', value: null },
      timezone: { source: 'unset', value: null },
    });
  });

  test('restores inheritance when an override is cleared', () => {
    expect(
      resolveEffectiveBranchConfiguration(configuredDefaults, {
        ...inheritingOverrides,
        timezone: null,
      }),
    ).toMatchObject({
      timezone: { source: 'restaurant_default', value: 'Asia/Karachi' },
    });
  });

  test('applies changed Restaurant defaults only to inheriting Branches', () => {
    const changedDefaults = { ...configuredDefaults, currency: 'USD' };
    const overridden = { ...inheritingOverrides, currency: 'EUR' };

    expect(
      resolveEffectiveBranchConfiguration(changedDefaults, inheritingOverrides).currency,
    ).toEqual({
      source: 'restaurant_default',
      value: 'USD',
    });
    expect(resolveEffectiveBranchConfiguration(changedDefaults, overridden).currency).toEqual({
      source: 'branch_override',
      value: 'EUR',
    });
  });
});
