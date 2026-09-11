import { RestaurantDomainError, restaurantStatuses, type RestaurantStatus } from './types.js';

function assertValidStatus(value: string, code: string, label: string): RestaurantStatus {
  if (!restaurantStatuses.includes(value as RestaurantStatus)) {
    throw new RestaurantDomainError(code, `${label} must be active or inactive.`);
  }

  return value as RestaurantStatus;
}

export function assertValidRestaurantStatus(value: string): RestaurantStatus {
  return assertValidStatus(value, 'restaurant.status_invalid', 'Restaurant status');
}

export function assertValidBranchStatus(value: string): RestaurantStatus {
  return assertValidStatus(value, 'branch.status_invalid', 'Branch status');
}

export function isBranchEffectivelyActive(
  restaurantStatus: RestaurantStatus,
  branchStatus: RestaurantStatus,
): boolean {
  return restaurantStatus === 'active' && branchStatus === 'active';
}
