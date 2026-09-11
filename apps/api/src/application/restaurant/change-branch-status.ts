import type { BranchLifecycleChangeRequest } from '@business-ai/contracts';
import type { ChangeBranchStatusInput } from '@business-ai/database';
import { assertValidBranchStatus } from '@business-ai/restaurant';

export function branchStatusMutation(
  lifecycle: BranchLifecycleChangeRequest,
): Pick<
  ChangeBranchStatusInput,
  'defaultBranchResolution' | 'expectedRestaurantVersion' | 'replacementBranchId' | 'status'
> {
  const resolution = lifecycle.defaultBranchResolution;
  return {
    status: assertValidBranchStatus(lifecycle.status),
    ...(resolution === undefined
      ? {}
      : {
          defaultBranchResolution: resolution.mode,
          expectedRestaurantVersion: resolution.restaurantVersion,
          ...(resolution.mode === 'replace' ? { replacementBranchId: resolution.branchId } : {}),
        }),
  };
}
