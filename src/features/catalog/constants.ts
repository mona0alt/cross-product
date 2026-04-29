export const publishableStatuses = [
  'draft',
  'pending',
  'published',
  'archived'
] as const;

export type PublishableStatus = (typeof publishableStatuses)[number];
