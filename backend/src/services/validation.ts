import { z } from "zod";
import { VENUE_TYPES } from "./constants.js";

export const optionalStringArray = z.array(z.string().min(1)).default([]);

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(80),
  homeCity: z.string().max(80).optional().nullable(),
  isPremium: z.boolean().default(false),
  preferredSports: optionalStringArray,
  preferredLeagues: optionalStringArray,
  favoriteTeamIds: optionalStringArray.optional(),
  preferredVenueTypes: z.array(z.enum(VENUE_TYPES)).default([]),
  travelModeEnabled: z.boolean().default(true)
});

export const venueSearchSchema = z.object({
  sport: z.string().optional(),
  league: z.string().optional(),
  teamId: z.string().optional(),
  gameId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  city: z.string().optional(),
  venueTypes: z.array(z.string()).default([]),
  radiusKm: z.number().min(1).max(100).default(25),
  query: z.string().optional()
});

export type VenueSearchInput = z.infer<typeof venueSearchSchema>;

export const assistantMessageSchema = z.object({
  message: z.string().min(1).max(500),
  context: z
    .object({
      topVenueId: z.string().optional(),
      sport: z.string().optional(),
      league: z.string().optional(),
      teamId: z.string().optional(),
      gameId: z.string().optional(),
      venueTypes: z.array(z.string()).optional(),
      city: z.string().optional()
    })
    .optional()
});
