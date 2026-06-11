import type { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";
import {
  MockAdProvider,
  MockBettingProvider,
  MockPartnerOfferProvider,
  MockTicketProvider
} from "../providers/mockProviders.js";

const ticketProvider = new MockTicketProvider();
const bettingProvider = new MockBettingProvider();
const adProvider = new MockAdProvider();
const partnerOfferProvider = new MockPartnerOfferProvider();

export async function getMonetizationForUser(
  prisma: PrismaClient,
  userId: string,
  options: { gameIds?: string[] } = {}
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isPremium = Boolean(user?.isPremium);
  const gameIds = options.gameIds ?? [];

  const [tickets, betting, ads, promotions] = await Promise.all([
    env.ENABLE_TICKETS_WIDGET && gameIds.length > 0 ? ticketProvider.getOffers(gameIds) : Promise.resolve([]),
    bettingProvider.getWidget(env.ENABLE_BETTING_WIDGET),
    env.ENABLE_AD_WIDGET && !isPremium ? adProvider.getAds(prisma) : Promise.resolve([]),
    env.ENABLE_PARTNER_PROMOTIONS ? partnerOfferProvider.getOffers(prisma) : Promise.resolve([])
  ]);

  return {
    tickets,
    betting,
    ads,
    promotions,
    premiumAdsHidden: isPremium
  };
}
