import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../data/prisma.js";
import { MockAdProvider, MockBettingProvider, MockPartnerOfferProvider, MockTicketProvider } from "../providers/mockProviders.js";
import { buildAgentCards } from "../services/agentService.js";
import { getOrCreateDemoUser } from "../services/demoUserService.js";
import { findVenueMatches, searchVenues } from "../services/venueSearchService.js";
import { assistantMessageSchema, profileUpdateSchema, venueSearchSchema } from "../services/validation.js";
import { handleAssistantMessage } from "../services/assistantService.js";

const router = Router();
const ticketProvider = new MockTicketProvider();
const bettingProvider = new MockBettingProvider();
const adProvider = new MockAdProvider();
const partnerOfferProvider = new MockPartnerOfferProvider();

type AsyncRoute = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler =
  (handler: AsyncRoute) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

const userIdParams = z.object({ userId: z.string().min(1) });

router.post(
  "/demo-user",
  asyncHandler(async (req, res) => {
    const body = z.object({ userId: z.string().optional() }).safeParse(req.body ?? {});
    const user = await getOrCreateDemoUser(prisma, body.success ? body.data.userId : undefined);
    res.json({ user });
  })
);

router.get(
  "/users/:userId/profile",
  asyncHandler(async (req, res) => {
    const { userId } = userIdParams.parse(req.params);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        favoriteTeams: { include: { team: true }, orderBy: { createdAt: "asc" } }
      }
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user });
  })
);

router.put(
  "/users/:userId/profile",
  asyncHandler(async (req, res) => {
    const { userId } = userIdParams.parse(req.params);
    const payload = profileUpdateSchema.parse(req.body);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          displayName: payload.displayName,
          homeCity: payload.homeCity ?? null,
          isPremium: payload.isPremium
        }
      });

      await tx.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          preferredSports: payload.preferredSports,
          preferredLeagues: payload.preferredLeagues,
          preferredVenueTypes: payload.preferredVenueTypes,
          travelModeEnabled: payload.travelModeEnabled
        },
        update: {
          preferredSports: payload.preferredSports,
          preferredLeagues: payload.preferredLeagues,
          preferredVenueTypes: payload.preferredVenueTypes,
          travelModeEnabled: payload.travelModeEnabled
        }
      });

      if (payload.favoriteTeamIds) {
        await tx.userFavoriteTeam.deleteMany({ where: { userId } });
        await tx.userFavoriteTeam.createMany({
          data: payload.favoriteTeamIds.map((teamId) => ({ userId, teamId })),
          skipDuplicates: true
        });
      }

      return tx.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          favoriteTeams: { include: { team: true }, orderBy: { createdAt: "asc" } }
        }
      });
    });

    res.json({ user: updated });
  })
);

router.get(
  "/teams",
  asyncHandler(async (req, res) => {
    const query = z
      .object({
        sport: z.string().optional(),
        league: z.string().optional(),
        q: z.string().optional()
      })
      .parse(req.query);

    const teams = await prisma.team.findMany({
      where: {
        ...(query.sport ? { sport: query.sport } : {}),
        ...(query.league ? { league: query.league } : {}),
        ...(query.q
          ? {
              OR: [
                { name: { contains: query.q, mode: "insensitive" } },
                { city: { contains: query.q, mode: "insensitive" } }
              ]
            }
          : {})
      },
      orderBy: [{ league: "asc" }, { name: "asc" }]
    });

    res.json({ teams });
  })
);

router.get(
  "/users/:userId/favorite-teams",
  asyncHandler(async (req, res) => {
    const { userId } = userIdParams.parse(req.params);
    const favoriteTeams = await prisma.userFavoriteTeam.findMany({
      where: { userId },
      include: { team: true },
      orderBy: { createdAt: "asc" }
    });
    res.json({ favoriteTeams });
  })
);

router.post(
  "/users/:userId/favorite-teams",
  asyncHandler(async (req, res) => {
    const { userId } = userIdParams.parse(req.params);
    const { teamId } = z.object({ teamId: z.string().min(1) }).parse(req.body);
    const favoriteTeam = await prisma.userFavoriteTeam.upsert({
      where: { userId_teamId: { userId, teamId } },
      create: { userId, teamId },
      update: {},
      include: { team: true }
    });
    res.status(201).json({ favoriteTeam });
  })
);

router.delete(
  "/users/:userId/favorite-teams/:teamId",
  asyncHandler(async (req, res) => {
    const params = z.object({ userId: z.string(), teamId: z.string() }).parse(req.params);
    await prisma.userFavoriteTeam.deleteMany({ where: params });
    res.status(204).send();
  })
);

router.get(
  "/games/upcoming",
  asyncHandler(async (req, res) => {
    const query = z
      .object({
        sport: z.string().optional(),
        league: z.string().optional(),
        teamId: z.string().optional()
      })
      .parse(req.query);

    const games = await prisma.game.findMany({
      where: {
        startTime: { gte: new Date() },
        ...(query.sport ? { sport: query.sport } : {}),
        ...(query.league ? { league: query.league } : {}),
        ...(query.teamId ? { OR: [{ homeTeamId: query.teamId }, { awayTeamId: query.teamId }] } : {})
      },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { startTime: "asc" },
      take: 12
    });
    res.json({ games });
  })
);

router.post(
  "/users/:userId/venues/search",
  asyncHandler(async (req, res) => {
    const { userId } = userIdParams.parse(req.params);
    const input = venueSearchSchema.parse(req.body);
    const results = await searchVenues(prisma, userId, input);
    res.json(results);
  })
);

router.get(
  "/users/:userId/saved-venues",
  asyncHandler(async (req, res) => {
    const { userId } = userIdParams.parse(req.params);
    const savedVenues = await prisma.userSavedVenue.findMany({
      where: { userId },
      include: { venue: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({ savedVenues });
  })
);

router.post(
  "/users/:userId/saved-venues/:venueId",
  asyncHandler(async (req, res) => {
    const params = z.object({ userId: z.string(), venueId: z.string() }).parse(req.params);
    const body = z.object({ notes: z.string().optional() }).parse(req.body ?? {});
    const savedVenue = await prisma.userSavedVenue.upsert({
      where: { userId_venueId: params },
      create: { ...params, notes: body.notes },
      update: { notes: body.notes },
      include: { venue: true }
    });
    res.status(201).json({ savedVenue });
  })
);

router.delete(
  "/users/:userId/saved-venues/:venueId",
  asyncHandler(async (req, res) => {
    const params = z.object({ userId: z.string(), venueId: z.string() }).parse(req.params);
    await prisma.userSavedVenue.deleteMany({ where: params });
    res.status(204).send();
  })
);

router.post(
  "/users/:userId/agent/recommendations",
  asyncHandler(async (req, res) => {
    const { userId } = userIdParams.parse(req.params);
    const input = venueSearchSchema.parse(req.body);
    const matches = await findVenueMatches(prisma, userId, input);
    const recommendations = buildAgentCards({
      venues: matches.venues,
      games: matches.games,
      tickets: matches.monetization.tickets,
      ads: matches.monetization.ads,
      promotions: matches.monetization.promotions,
      isPremium: matches.user.isPremium,
      search: input
    });
    res.json({ recommendations });
  })
);

router.post(
  "/users/:userId/assistant/message",
  asyncHandler(async (req, res) => {
    const { userId } = userIdParams.parse(req.params);
    const payload = assistantMessageSchema.parse(req.body);
    const response = await handleAssistantMessage(prisma, userId, payload.message, payload.context);
    res.json(response);
  })
);

router.get(
  "/monetization/tickets",
  asyncHandler(async (req, res) => {
    const query = z.object({ gameId: z.string().optional() }).parse(req.query);
    const offers = await ticketProvider.getOffers(query.gameId ? [query.gameId] : []);
    res.json({ offers, enabled: env.ENABLE_TICKETS_WIDGET });
  })
);

router.get(
  "/monetization/betting",
  asyncHandler(async (_req, res) => {
    const widget = await bettingProvider.getWidget(env.ENABLE_BETTING_WIDGET);
    res.json(widget);
  })
);

router.get(
  "/monetization/ads",
  asyncHandler(async (req, res) => {
    const query = z.object({ userId: z.string().optional() }).parse(req.query);
    if (!env.ENABLE_AD_WIDGET) {
      res.json({ ads: [], enabled: false });
      return;
    }
    if (query.userId) {
      const user = await prisma.user.findUnique({ where: { id: query.userId } });
      if (user?.isPremium) {
        res.json({ ads: [], enabled: true, premiumAdsHidden: true });
        return;
      }
    }
    const ads = await adProvider.getAds(prisma);
    res.json({ ads, enabled: true });
  })
);

router.get(
  "/monetization/promotions",
  asyncHandler(async (_req, res) => {
    const promotions = env.ENABLE_PARTNER_PROMOTIONS ? await partnerOfferProvider.getOffers(prisma) : [];
    res.json({ promotions, enabled: env.ENABLE_PARTNER_PROMOTIONS });
  })
);

export { router as apiRouter };
