import { z } from 'zod';

import { toDraft7JsonSchema, type Draft7JsonSchema } from './json-schema.ts';

const UuidSchema = z.string().uuid();
const PositiveIntegerSchema = z.number().int().positive();
const LifecycleStatusSchema = z.enum(['active', 'inactive']);
const NullableStringSchema = z.string().nullable();
const NullableBooleanSchema = z.boolean().nullable();

const RestaurantDefaultsSchema = z
  .object({
    currency: NullableStringSchema,
    deliveryEnabled: NullableBooleanSchema,
    locale: NullableStringSchema,
    pickupEnabled: NullableBooleanSchema,
    timezone: NullableStringSchema,
  })
  .strict();

const BranchRegionalOverridesSchema = z
  .object({
    currency: NullableStringSchema,
    locale: NullableStringSchema,
    timezone: NullableStringSchema,
  })
  .strict();

const BranchCapabilitiesSchema = z
  .object({
    deliveryEnabledOverride: NullableBooleanSchema,
    pickupEnabledOverride: NullableBooleanSchema,
  })
  .strict();

const BranchAddressSchema = z
  .object({
    area: NullableStringSchema,
    city: NullableStringSchema,
    countryCode: NullableStringSchema,
    latitude: z.number().nullable(),
    line1: NullableStringSchema,
    line2: NullableStringSchema,
    longitude: z.number().nullable(),
    postalCode: NullableStringSchema,
    region: NullableStringSchema,
  })
  .strict();

const BranchContactSchema = z
  .object({
    email: NullableStringSchema,
    phone: NullableStringSchema,
  })
  .strict();

function effectiveValueSchema<T extends z.ZodType>(valueSchema: T) {
  return z
    .object({
      source: z.enum(['restaurant_default', 'branch_override', 'unset']),
      value: z.union([valueSchema, z.null()]),
    })
    .strict();
}

const EffectiveBranchConfigurationSchema = z
  .object({
    currency: effectiveValueSchema(z.string()),
    deliveryEnabled: effectiveValueSchema(z.boolean()),
    locale: effectiveValueSchema(z.string()),
    pickupEnabled: effectiveValueSchema(z.boolean()),
    timezone: effectiveValueSchema(z.string()),
  })
  .strict();

export const RestaurantDetailSchema = z
  .object({
    businessName: NullableStringSchema,
    defaultBranchId: UuidSchema.nullable(),
    defaults: RestaurantDefaultsSchema,
    email: NullableStringSchema,
    id: UuidSchema,
    name: z.string(),
    organisationId: UuidSchema,
    phone: NullableStringSchema,
    status: LifecycleStatusSchema,
    version: PositiveIntegerSchema,
  })
  .strict();

export const BranchSummarySchema = z
  .object({
    city: NullableStringSchema,
    code: NullableStringSchema,
    countryCode: NullableStringSchema,
    id: UuidSchema,
    isDefault: z.boolean(),
    name: z.string(),
    organisationId: UuidSchema,
    restaurantId: UuidSchema,
    status: LifecycleStatusSchema,
    version: PositiveIntegerSchema,
  })
  .strict();

export const BranchDetailSchema = z
  .object({
    address: BranchAddressSchema,
    capabilities: BranchCapabilitiesSchema,
    code: NullableStringSchema,
    contact: BranchContactSchema,
    effectiveConfiguration: EffectiveBranchConfigurationSchema,
    id: UuidSchema,
    name: z.string(),
    organisationId: UuidSchema,
    overrides: BranchRegionalOverridesSchema,
    restaurantId: UuidSchema,
    status: LifecycleStatusSchema,
    version: PositiveIntegerSchema,
  })
  .strict();

export const UpdateRestaurantProfileRequestSchema = z
  .object({
    businessName: NullableStringSchema.optional(),
    email: NullableStringSchema.optional(),
    name: z.string().optional(),
    phone: NullableStringSchema.optional(),
  })
  .strict();

export const UpdateRestaurantDefaultsRequestSchema = z
  .object({
    currency: NullableStringSchema.optional(),
    deliveryEnabled: NullableBooleanSchema.optional(),
    locale: NullableStringSchema.optional(),
    pickupEnabled: NullableBooleanSchema.optional(),
    timezone: NullableStringSchema.optional(),
  })
  .strict();

export const DefaultBranchResolutionSchema = z.union([
  z
    .object({
      mode: z.literal('clear'),
      restaurantVersion: PositiveIntegerSchema,
    })
    .strict(),
  z
    .object({
      branchId: UuidSchema,
      mode: z.literal('replace'),
      restaurantVersion: PositiveIntegerSchema,
    })
    .strict(),
]);

export const SetDefaultBranchRequestSchema = DefaultBranchResolutionSchema;

export const RestaurantLifecycleChangeRequestSchema = z
  .object({
    status: LifecycleStatusSchema,
  })
  .strict();

export const RestaurantConfigurationMutationRequestSchema = z
  .object({
    defaults: UpdateRestaurantDefaultsRequestSchema.optional(),
    profile: UpdateRestaurantProfileRequestSchema.optional(),
  })
  .strict()
  .refine((body) => body.defaults !== undefined || body.profile !== undefined);

export const RestaurantMutationRequestSchema = z.union([
  RestaurantConfigurationMutationRequestSchema,
  z.object({ defaultBranch: SetDefaultBranchRequestSchema }).strict(),
  z.object({ lifecycle: RestaurantLifecycleChangeRequestSchema }).strict(),
]);

export const CreateBranchRequestSchema = z
  .object({
    address: BranchAddressSchema.partial().strict().optional(),
    capabilities: z
      .object({
        deliveryEnabled: NullableBooleanSchema.optional(),
        pickupEnabled: NullableBooleanSchema.optional(),
      })
      .strict()
      .optional(),
    code: NullableStringSchema.optional(),
    contact: BranchContactSchema.partial().strict().optional(),
    name: z.string(),
    overrides: BranchRegionalOverridesSchema.partial().strict().optional(),
  })
  .strict();

export const BranchProfileUpdateRequestSchema = z
  .object({
    code: NullableStringSchema.optional(),
    name: z.string().optional(),
  })
  .strict();

export const BranchAddressUpdateRequestSchema = BranchAddressSchema.partial().strict();

export const BranchContactUpdateRequestSchema = BranchContactSchema.partial().strict();

export const BranchRegionalOverridesUpdateRequestSchema =
  BranchRegionalOverridesSchema.partial().strict();

export const BranchCapabilitiesUpdateRequestSchema = z
  .object({
    deliveryEnabled: NullableBooleanSchema.optional(),
    pickupEnabled: NullableBooleanSchema.optional(),
  })
  .strict();

export const BranchLifecycleChangeRequestSchema = z
  .object({
    defaultBranchResolution: DefaultBranchResolutionSchema.optional(),
    status: LifecycleStatusSchema,
  })
  .strict();

export const BranchConfigurationMutationRequestSchema = z
  .object({
    address: BranchAddressUpdateRequestSchema.optional(),
    capabilities: BranchCapabilitiesUpdateRequestSchema.optional(),
    contact: BranchContactUpdateRequestSchema.optional(),
    overrides: BranchRegionalOverridesUpdateRequestSchema.optional(),
    profile: BranchProfileUpdateRequestSchema.optional(),
  })
  .strict()
  .refine(
    (body) =>
      body.address !== undefined ||
      body.capabilities !== undefined ||
      body.contact !== undefined ||
      body.overrides !== undefined ||
      body.profile !== undefined,
  );

export const BranchMutationRequestSchema = z.union([
  BranchConfigurationMutationRequestSchema,
  z.object({ lifecycle: BranchLifecycleChangeRequestSchema }).strict(),
]);

export const UpdateRestaurantProfileRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  UpdateRestaurantProfileRequestSchema,
);
export const UpdateRestaurantDefaultsRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  UpdateRestaurantDefaultsRequestSchema,
);
export const SetDefaultBranchRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  SetDefaultBranchRequestSchema,
);
export const RestaurantLifecycleChangeRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  RestaurantLifecycleChangeRequestSchema,
);
export const CreateBranchRequestJsonSchema: Draft7JsonSchema =
  toDraft7JsonSchema(CreateBranchRequestSchema);
export const BranchProfileUpdateRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  BranchProfileUpdateRequestSchema,
);
export const BranchAddressUpdateRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  BranchAddressUpdateRequestSchema,
);
export const BranchContactUpdateRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  BranchContactUpdateRequestSchema,
);
export const BranchRegionalOverridesUpdateRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  BranchRegionalOverridesUpdateRequestSchema,
);
export const BranchCapabilitiesUpdateRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  BranchCapabilitiesUpdateRequestSchema,
);
export const BranchLifecycleChangeRequestJsonSchema: Draft7JsonSchema = toDraft7JsonSchema(
  BranchLifecycleChangeRequestSchema,
);

export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;
export type BranchSummary = z.infer<typeof BranchSummarySchema>;
export type BranchDetail = z.infer<typeof BranchDetailSchema>;
export type UpdateRestaurantProfileRequest = z.infer<typeof UpdateRestaurantProfileRequestSchema>;
export type UpdateRestaurantDefaultsRequest = z.infer<typeof UpdateRestaurantDefaultsRequestSchema>;
export type DefaultBranchResolution = z.infer<typeof DefaultBranchResolutionSchema>;
export type SetDefaultBranchRequest = z.infer<typeof SetDefaultBranchRequestSchema>;
export type RestaurantLifecycleChangeRequest = z.infer<
  typeof RestaurantLifecycleChangeRequestSchema
>;
export type CreateBranchRequest = z.infer<typeof CreateBranchRequestSchema>;
export type BranchProfileUpdateRequest = z.infer<typeof BranchProfileUpdateRequestSchema>;
export type BranchAddressUpdateRequest = z.infer<typeof BranchAddressUpdateRequestSchema>;
export type BranchContactUpdateRequest = z.infer<typeof BranchContactUpdateRequestSchema>;
export type BranchRegionalOverridesUpdateRequest = z.infer<
  typeof BranchRegionalOverridesUpdateRequestSchema
>;
export type BranchCapabilitiesUpdateRequest = z.infer<typeof BranchCapabilitiesUpdateRequestSchema>;
export type BranchLifecycleChangeRequest = z.infer<typeof BranchLifecycleChangeRequestSchema>;
export type BranchMutationRequest = z.infer<typeof BranchMutationRequestSchema>;
export type RestaurantMutationRequest = z.infer<typeof RestaurantMutationRequestSchema>;
