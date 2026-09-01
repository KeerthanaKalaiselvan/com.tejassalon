// Excludes the internal many-to-many relation-scalar arrays (interestedUserIds,
// appointmentIds) that MongoDB relations store directly on the Service document —
// those aren't meant to leave the server, especially on public endpoints.
export const SERVICE_SELECT = {
  id: true,
  slug: true,
  name: true,
  category: true,
  description: true,
  priceFrom: true,
  durationMin: true,
  image: true,
  keywords: true,
  featured: true,
  sortOrder: true,
  createdAt: true,
} as const;
