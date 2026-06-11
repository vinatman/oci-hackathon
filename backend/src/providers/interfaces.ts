import type { PrismaClient } from "@prisma/client";
import type { BettingWidget, TicketOffer } from "../types/api.js";
import type { VenueSearchInput } from "../services/validation.js";

export interface VenueDiscoveryProvider {
  name: string;
  search(prisma: PrismaClient, input: VenueSearchInput): Promise<unknown[]>;
}

export interface GameDiscoveryProvider {
  name: string;
  upcoming(prisma: PrismaClient, input: VenueSearchInput): Promise<unknown[]>;
}

export interface TicketProvider {
  name: string;
  getOffers(gameIds: string[]): Promise<TicketOffer[]>;
}

export interface BettingProvider {
  name: string;
  getWidget(enabled: boolean): Promise<BettingWidget>;
}

export interface AdProvider {
  name: string;
  getAds(prisma: PrismaClient): Promise<unknown[]>;
}

export interface PartnerOfferProvider {
  name: string;
  getOffers(prisma: PrismaClient): Promise<unknown[]>;
}
