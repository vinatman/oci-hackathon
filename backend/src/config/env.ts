import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../.env" });
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").optional(),
  PORT: z.coerce.number().default(4000),
  ENABLE_WEB_SEARCH_PROVIDER: z.coerce.boolean().default(false),
  ENABLE_TICKETS_WIDGET: z.coerce.boolean().default(true),
  ENABLE_BETTING_WIDGET: z.coerce.boolean().default(false),
  ENABLE_AD_WIDGET: z.coerce.boolean().default(true),
  ENABLE_PARTNER_PROMOTIONS: z.coerce.boolean().default(true),
  REVERSE_GEOCODING_PROVIDER: z.enum(["demo", "nominatim", "none"]).default("demo"),
  REVERSE_GEOCODING_ENDPOINT: z.string().url().default("https://nominatim.openstreetmap.org/reverse"),
  REVERSE_GEOCODING_TIMEOUT_MS: z.coerce.number().default(4000),
  REVERSE_GEOCODING_USER_AGENT: z.string().default("SportsConnectMVP/0.1 (demo reverse geocoding)"),
  TICKETMASTER_API_KEY: z.string().optional().default(""),
  SPORTS_DATA_API_KEY: z.string().optional().default("")
});

export const env = envSchema.parse(process.env);
