import { RestaurantDomainError, type BranchReference } from './types.js';

export interface DefaultBranchAssignmentInput {
  readonly branch: BranchReference | null;
  readonly restaurantId: string;
}

export type DefaultBranchResolution =
  { readonly mode: 'clear' } | { readonly branch: BranchReference; readonly mode: 'replace' };

export interface DefaultBranchDeactivationInput {
  readonly currentDefaultBranchId: string | null;
  readonly deactivatingBranchId: string;
  readonly resolution?: DefaultBranchResolution;
  readonly restaurantId: string;
}

export function assertDefaultBranchAssignment({
  branch,
  restaurantId,
}: DefaultBranchAssignmentInput): string | null {
  if (branch === null) {
    return null;
  }

  if (branch.restaurantId !== restaurantId) {
    throw new RestaurantDomainError(
      'default_branch.restaurant_mismatch',
      'Default Branch must belong to the same Restaurant.',
    );
  }

  if (branch.status !== 'active') {
    throw new RestaurantDomainError(
      'default_branch.inactive',
      'An inactive Branch cannot be assigned as Default Branch.',
    );
  }

  return branch.branchId;
}

export function assertDefaultBranchDeactivationAllowed({
  currentDefaultBranchId,
  deactivatingBranchId,
  resolution,
  restaurantId,
}: DefaultBranchDeactivationInput): void {
  if (currentDefaultBranchId !== deactivatingBranchId) {
    return;
  }

  if (resolution === undefined) {
    throw new RestaurantDomainError(
      'default_branch.resolution_required',
      'Deactivating the current Default Branch requires explicit clear or replace resolution.',
    );
  }

  if (resolution.mode === 'clear') {
    return;
  }

  if (resolution.branch.branchId === deactivatingBranchId) {
    throw new RestaurantDomainError(
      'default_branch.replacement_must_differ',
      'A replacement Default Branch must differ from the Branch being deactivated.',
    );
  }

  assertDefaultBranchAssignment({
    branch: resolution.branch,
    restaurantId,
  });
}
