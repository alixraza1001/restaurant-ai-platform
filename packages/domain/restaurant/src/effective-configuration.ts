import type {
  EffectiveBranchConfiguration,
  EffectiveValue,
  FulfillmentDefaults,
  FulfillmentOverrides,
  RegionalDefaults,
  RegionalOverrides,
} from './types.js';

type RestaurantDefaults = RegionalDefaults & FulfillmentDefaults;
type BranchOverrides = RegionalOverrides & FulfillmentOverrides;

function resolveEffectiveValue<T>(
  restaurantDefault: T | null,
  branchOverride: T | null,
): EffectiveValue<T> {
  if (branchOverride !== null) {
    return { source: 'branch_override', value: branchOverride };
  }

  if (restaurantDefault !== null) {
    return { source: 'restaurant_default', value: restaurantDefault };
  }

  return { source: 'unset', value: null };
}

export function resolveEffectiveBranchConfiguration(
  defaults: RestaurantDefaults,
  overrides: BranchOverrides,
): EffectiveBranchConfiguration {
  return {
    currency: resolveEffectiveValue(defaults.currency, overrides.currency),
    deliveryEnabled: resolveEffectiveValue(defaults.deliveryEnabled, overrides.deliveryEnabled),
    locale: resolveEffectiveValue(defaults.locale, overrides.locale),
    pickupEnabled: resolveEffectiveValue(defaults.pickupEnabled, overrides.pickupEnabled),
    timezone: resolveEffectiveValue(defaults.timezone, overrides.timezone),
  };
}
