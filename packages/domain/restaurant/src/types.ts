export const restaurantStatuses = ['active', 'inactive'] as const;

export type RestaurantStatus = (typeof restaurantStatuses)[number];

export class RestaurantDomainError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'RestaurantDomainError';
  }
}

export interface RegionalDefaults {
  readonly currency: string | null;
  readonly locale: string | null;
  readonly timezone: string | null;
}

export interface RegionalOverrides {
  readonly currency: string | null;
  readonly locale: string | null;
  readonly timezone: string | null;
}

export interface FulfillmentDefaults {
  readonly deliveryEnabled: boolean | null;
  readonly pickupEnabled: boolean | null;
}

export interface FulfillmentOverrides {
  readonly deliveryEnabled: boolean | null;
  readonly pickupEnabled: boolean | null;
}

export interface EffectiveValue<T> {
  readonly source: 'restaurant_default' | 'branch_override' | 'unset';
  readonly value: T | null;
}

export interface EffectiveBranchConfiguration {
  readonly currency: EffectiveValue<string>;
  readonly deliveryEnabled: EffectiveValue<boolean>;
  readonly locale: EffectiveValue<string>;
  readonly pickupEnabled: EffectiveValue<boolean>;
  readonly timezone: EffectiveValue<string>;
}

export interface BranchReference {
  readonly branchId: string;
  readonly restaurantId: string;
  readonly status: RestaurantStatus;
}
