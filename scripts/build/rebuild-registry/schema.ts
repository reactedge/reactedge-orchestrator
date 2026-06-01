import { z } from 'zod';

export const WidgetRegistryEntrySchema = z.object({
    widget: z.string().optional(),
    cdn: z.string(),
    css: z.string().optional()
});

export const RegistrySchema = z.record(
    z.string(),
    WidgetRegistryEntrySchema
);

export type WidgetRegistryEntry =
    z.infer<typeof WidgetRegistryEntrySchema>;

export type WidgetRegistry =
    z.infer<typeof RegistrySchema>;