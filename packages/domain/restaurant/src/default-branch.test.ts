import { describe, expect, test } from 'vitest';

import {
  RestaurantDomainError,
  assertDefaultBranchAssignment,
  assertDefaultBranchDeactivationAllowed,
} from './index.ts';

const restaurantId = 'restaurant-a';
const activeBranch = {
  branchId: 'branch-a1',
  restaurantId,
  status: 'active' as const,
};

describe('Default Branch rules', () => {
  test('allows a Restaurant to have no Default Branch', () => {
    expect(assertDefaultBranchAssignment({ branch: null, restaurantId })).toBeNull();
  });

  test('allows only an active Branch owned by the same Restaurant to become default', () => {
    expect(assertDefaultBranchAssignment({ branch: activeBranch, restaurantId })).toBe('branch-a1');

    expect(() =>
      assertDefaultBranchAssignment({
        branch: { ...activeBranch, restaurantId: 'restaurant-b' },
        restaurantId,
      }),
    ).toThrowError(
      expect.objectContaining<Partial<RestaurantDomainError>>({
        code: 'default_branch.restaurant_mismatch',
      }),
    );

    expect(() =>
      assertDefaultBranchAssignment({
        branch: { ...activeBranch, status: 'inactive' },
        restaurantId,
      }),
    ).toThrowError(
      expect.objectContaining<Partial<RestaurantDomainError>>({
        code: 'default_branch.inactive',
      }),
    );
  });

  test('requires explicit clear or replace when deactivating the current default', () => {
    expect(() =>
      assertDefaultBranchDeactivationAllowed({
        currentDefaultBranchId: activeBranch.branchId,
        deactivatingBranchId: activeBranch.branchId,
        restaurantId,
      }),
    ).toThrowError(
      expect.objectContaining<Partial<RestaurantDomainError>>({
        code: 'default_branch.resolution_required',
      }),
    );

    expect(() =>
      assertDefaultBranchDeactivationAllowed({
        currentDefaultBranchId: activeBranch.branchId,
        deactivatingBranchId: activeBranch.branchId,
        resolution: { mode: 'clear' },
        restaurantId,
      }),
    ).not.toThrow();
  });

  test('requires a replacement default to be active and owned by the same Restaurant', () => {
    expect(() =>
      assertDefaultBranchDeactivationAllowed({
        currentDefaultBranchId: activeBranch.branchId,
        deactivatingBranchId: activeBranch.branchId,
        resolution: {
          branch: { ...activeBranch, branchId: 'branch-a2' },
          mode: 'replace',
        },
        restaurantId,
      }),
    ).not.toThrow();

    expect(() =>
      assertDefaultBranchDeactivationAllowed({
        currentDefaultBranchId: activeBranch.branchId,
        deactivatingBranchId: activeBranch.branchId,
        resolution: {
          branch: { ...activeBranch, branchId: 'branch-b1', restaurantId: 'restaurant-b' },
          mode: 'replace',
        },
        restaurantId,
      }),
    ).toThrowError(
      expect.objectContaining<Partial<RestaurantDomainError>>({
        code: 'default_branch.restaurant_mismatch',
      }),
    );

    expect(() =>
      assertDefaultBranchDeactivationAllowed({
        currentDefaultBranchId: activeBranch.branchId,
        deactivatingBranchId: activeBranch.branchId,
        resolution: {
          branch: { ...activeBranch, branchId: 'branch-a2', status: 'inactive' },
          mode: 'replace',
        },
        restaurantId,
      }),
    ).toThrowError(
      expect.objectContaining<Partial<RestaurantDomainError>>({
        code: 'default_branch.inactive',
      }),
    );
  });
});
