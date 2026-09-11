import { describe, expect, test } from 'vitest';

import {
  BranchDetailSchema,
  BranchSummarySchema,
  BranchLifecycleChangeRequestSchema,
  BranchRegionalOverridesUpdateRequestSchema,
  BranchCapabilitiesUpdateRequestSchema,
  CreateBranchRequestSchema,
  DefaultBranchResolutionSchema,
  RestaurantDetailSchema,
  RestaurantMutationRequestSchema,
  UpdateRestaurantProfileRequestJsonSchema,
  UpdateRestaurantProfileRequestSchema,
} from './restaurant-configuration.ts';
import { toDraft7JsonSchema } from './json-schema.ts';

const organisationId = '11111111-1111-4111-8111-111111111111';
const restaurantId = '22222222-2222-4222-8222-222222222222';
const branchId = '33333333-3333-4333-8333-333333333333';

describe('Restaurant/Branch configuration contracts', () => {
  test('parses Branch summaries with the approved stored location and default fields', () => {
    expect(
      BranchSummarySchema.parse({
        city: 'Karachi',
        code: 'CLIFTON-1',
        countryCode: 'PK',
        id: branchId,
        isDefault: true,
        name: 'Clifton',
        organisationId,
        restaurantId,
        status: 'active',
        version: 1,
      }),
    ).toMatchObject({ city: 'Karachi', countryCode: 'PK', isDefault: true });
  });

  test('accepts unset Branch summary location values', () => {
    expect(
      BranchSummarySchema.safeParse({
        city: null,
        code: null,
        countryCode: null,
        id: branchId,
        isDefault: false,
        name: 'Clifton',
        organisationId,
        restaurantId,
        status: 'active',
        version: 1,
      }).success,
    ).toBe(true);
  });

  test('requires isDefault and rejects unknown Branch summary fields', () => {
    const branchSummary = {
      city: 'Karachi',
      code: 'CLIFTON-1',
      countryCode: 'PK',
      id: branchId,
      name: 'Clifton',
      organisationId,
      restaurantId,
      status: 'active',
      version: 1,
    };

    expect(BranchSummarySchema.safeParse(branchSummary).success).toBe(false);
    expect(
      BranchSummarySchema.safeParse({ ...branchSummary, isDefault: false, unknown: true }).success,
    ).toBe(false);
    expect(
      BranchSummarySchema.safeParse({
        ...branchSummary,
        isDefault: false,
        isEffectivelyActive: true,
      }).success,
    ).toBe(false);
  });

  test('retains Branch summary strictness in Draft 7 JSON Schema', () => {
    expect(toDraft7JsonSchema(BranchSummarySchema)).toMatchObject({
      additionalProperties: false,
      type: 'object',
    });
  });

  test('parses valid Restaurant detail with configuration and version', () => {
    expect(
      RestaurantDetailSchema.parse({
        businessName: null,
        defaultBranchId: null,
        defaults: {
          currency: 'PKR',
          deliveryEnabled: true,
          locale: 'en-PK',
          pickupEnabled: false,
          timezone: 'Asia/Karachi',
        },
        email: null,
        id: restaurantId,
        name: 'Café One',
        organisationId,
        phone: null,
        status: 'active',
        version: 1,
      }),
    ).toMatchObject({ id: restaurantId, status: 'active', version: 1 });
  });

  test('parses Branch detail while preserving stored overrides and effective provenance', () => {
    expect(
      BranchDetailSchema.parse({
        address: {
          area: null,
          city: 'Karachi',
          countryCode: 'PK',
          latitude: 24.8607,
          line1: '1 Food Street',
          line2: null,
          longitude: 67.0011,
          postalCode: null,
          region: null,
        },
        capabilities: {
          deliveryEnabledOverride: null,
          pickupEnabledOverride: false,
        },
        code: 'CLIFTON-1',
        contact: { email: null, phone: null },
        effectiveConfiguration: {
          currency: { source: 'restaurant_default', value: 'PKR' },
          deliveryEnabled: { source: 'branch_override', value: false },
          locale: { source: 'unset', value: null },
          pickupEnabled: { source: 'branch_override', value: false },
          timezone: { source: 'restaurant_default', value: 'Asia/Karachi' },
        },
        id: branchId,
        name: 'Clifton',
        organisationId,
        overrides: {
          currency: null,
          locale: null,
          timezone: null,
        },
        restaurantId,
        status: 'active',
        version: 1,
      }),
    ).toMatchObject({
      capabilities: { pickupEnabledOverride: false },
      effectiveConfiguration: { currency: { source: 'restaurant_default' } },
      id: branchId,
    });
  });

  test('rejects unknown Restaurant and Branch mutation fields', () => {
    expect(
      UpdateRestaurantProfileRequestSchema.safeParse({
        name: 'Café One',
        organisationId,
      }).success,
    ).toBe(false);
    expect(
      CreateBranchRequestSchema.safeParse({
        name: 'Clifton',
        restaurantId,
      }).success,
    ).toBe(false);
  });

  test('rejects malformed UUIDs and non-positive resource versions', () => {
    expect(
      RestaurantDetailSchema.safeParse({
        businessName: null,
        defaultBranchId: null,
        defaults: {
          currency: null,
          deliveryEnabled: null,
          locale: null,
          pickupEnabled: null,
          timezone: null,
        },
        email: null,
        id: 'not-a-uuid',
        name: 'Café One',
        organisationId,
        phone: null,
        status: 'active',
        version: 0,
      }).success,
    ).toBe(false);
  });

  test('accepts nullable Branch overrides and explicit false capability overrides', () => {
    expect(
      BranchRegionalOverridesUpdateRequestSchema.parse({
        currency: null,
        locale: null,
        timezone: 'Asia/Karachi',
      }),
    ).toEqual({ currency: null, locale: null, timezone: 'Asia/Karachi' });
    expect(
      BranchCapabilitiesUpdateRequestSchema.parse({
        deliveryEnabled: false,
        pickupEnabled: null,
      }),
    ).toEqual({ deliveryEnabled: false, pickupEnabled: null });
  });

  test.each([null, true, false])(
    'preserves Restaurant nullable fulfillment value %s in the strict mutation contract',
    (deliveryEnabled) => {
      expect(
        RestaurantMutationRequestSchema.parse({
          defaults: {
            currency: null,
            deliveryEnabled,
            locale: null,
            pickupEnabled: null,
            timezone: null,
          },
          profile: { name: 'Café One' },
        }),
      ).toEqual({
        defaults: {
          currency: null,
          deliveryEnabled,
          locale: null,
          pickupEnabled: null,
          timezone: null,
        },
        profile: { name: 'Café One' },
      });
    },
  );

  test('rejects mixed or unknown Restaurant mutation fields at the strict union boundary', () => {
    expect(
      RestaurantMutationRequestSchema.safeParse({
        lifecycle: { status: 'inactive' },
        profile: { name: 'Café One' },
      }).success,
    ).toBe(false);
    expect(
      RestaurantMutationRequestSchema.safeParse({
        profile: { name: 'Café One' },
        restaurantId,
      }).success,
    ).toBe(false);
  });

  test('accepts only active and inactive lifecycle values', () => {
    expect(BranchLifecycleChangeRequestSchema.safeParse({ status: 'paused' }).success).toBe(false);
    expect(BranchLifecycleChangeRequestSchema.safeParse({ status: 'inactive' }).success).toBe(true);
  });

  test('accepts only strict clear or replace Default Branch resolutions', () => {
    expect(
      DefaultBranchResolutionSchema.parse({
        mode: 'clear',
        restaurantVersion: 3,
      }),
    ).toEqual({ mode: 'clear', restaurantVersion: 3 });
    expect(
      DefaultBranchResolutionSchema.parse({
        branchId,
        mode: 'replace',
        restaurantVersion: 3,
      }),
    ).toEqual({ branchId, mode: 'replace', restaurantVersion: 3 });
    expect(
      DefaultBranchResolutionSchema.safeParse({
        mode: 'replace',
        restaurantVersion: 3,
      }).success,
    ).toBe(false);
    expect(
      DefaultBranchResolutionSchema.safeParse({
        branchId,
        mode: 'clear',
        restaurantVersion: 3,
      }).success,
    ).toBe(false);
  });

  test('retains mutation strictness in Draft 7 JSON Schema', () => {
    expect(UpdateRestaurantProfileRequestJsonSchema).toMatchObject({
      additionalProperties: false,
      type: 'object',
    });
  });
});
