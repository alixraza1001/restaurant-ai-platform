import type { SupportActor, TenantActor } from '@business-ai/database/actor';
import type { RestaurantMutationDataSource, RestaurantReadRepository } from '@business-ai/database';

export type RestaurantReadActor = TenantActor | SupportActor;

export type RestaurantReadRepositoryPort = Pick<
  RestaurantReadRepository,
  'getBranch' | 'getEffectiveBranchConfiguration' | 'getRestaurant' | 'listBranches'
>;

export type RestaurantMutationDataSourcePort = Pick<
  RestaurantMutationDataSource,
  | 'changeBranchStatus'
  | 'changeRestaurantStatus'
  | 'createBranchIdempotently'
  | 'setRestaurantDefaultBranch'
  | 'updateBranchConfiguration'
  | 'updateRestaurantConfiguration'
>;
