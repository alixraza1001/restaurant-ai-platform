import { describe, expect, test } from 'vitest';

import {
  RestaurantDomainError,
  assertValidBranchStatus,
  assertValidRestaurantStatus,
  isBranchEffectivelyActive,
  restaurantStatuses,
} from './index.ts';

describe('Restaurant/Branch lifecycle', () => {
  test('defines active and inactive as the only stored lifecycle statuses', () => {
    expect(restaurantStatuses).toEqual(['active', 'inactive']);
    expect(assertValidRestaurantStatus('active')).toBe('active');
    expect(assertValidBranchStatus('inactive')).toBe('inactive');
  });

  test('rejects a status outside the M2-A lifecycle contract', () => {
    expect(() => assertValidRestaurantStatus('paused')).toThrowError(
      expect.objectContaining<Partial<RestaurantDomainError>>({
        code: 'restaurant.status_invalid',
      }),
    );
    expect(() => assertValidBranchStatus('draft')).toThrowError(
      expect.objectContaining<Partial<RestaurantDomainError>>({
        code: 'branch.status_invalid',
      }),
    );
  });

  test.each([
    ['active', 'active', true],
    ['active', 'inactive', false],
    ['inactive', 'active', false],
    ['inactive', 'inactive', false],
  ] as const)(
    'computes effective Branch activity from Restaurant %s and Branch %s',
    (restaurantStatus, branchStatus, expected) => {
      expect(isBranchEffectivelyActive(restaurantStatus, branchStatus)).toBe(expected);
    },
  );

  test('does not rewrite stored Branch status when a Restaurant is deactivated', () => {
    const storedBranchStatus = 'active' as const;

    expect(isBranchEffectivelyActive('inactive', storedBranchStatus)).toBe(false);
    expect(storedBranchStatus).toBe('active');
  });
});
