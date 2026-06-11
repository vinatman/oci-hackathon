import type { Prisma, PrismaClient } from "@prisma/client";

type DemoUser = Prisma.UserGetPayload<{
  include: { profile: true; favoriteTeams: { include: { team: true } } };
}>;

export const buildDefaultDemoUserProfile = () => ({
  displayName: "Traveling Fan",
  homeCity: "Los Angeles",
  isPremium: false,
  profile: {
    preferredSports: ["Basketball", "Football"],
    preferredLeagues: ["NBA", "NFL"],
    preferredVenueTypes: ["Sports bar", "Watch party"],
    travelModeEnabled: true
  }
});

function includeDemoUserRelations() {
  return { profile: true, favoriteTeams: { include: { team: true }, orderBy: { createdAt: "asc" as const } } };
}

async function normalizeExistingDemoUser(prisma: PrismaClient, user: DemoUser) {
  if (user.displayName !== "Demo Fan") {
    return user;
  }

  return prisma.user.update({
    where: { id: user.id },
    data: { displayName: "Traveling Fan" },
    include: includeDemoUserRelations()
  });
}

export async function getOrCreateDemoUser(prisma: PrismaClient, userId?: string) {
  if (userId) {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      include: includeDemoUserRelations()
    });
    if (existing) {
      return normalizeExistingDemoUser(prisma, existing);
    }
  }

  const demoDefaults = buildDefaultDemoUserProfile();
  const lakers = await prisma.team.findFirst({ where: { name: "Los Angeles Lakers" } });
  const cowboys = await prisma.team.findFirst({ where: { name: "Dallas Cowboys" } });

  return prisma.user.create({
    data: {
      displayName: demoDefaults.displayName,
      homeCity: demoDefaults.homeCity,
      isPremium: demoDefaults.isPremium,
      profile: {
        create: demoDefaults.profile
      },
      favoriteTeams: {
        create: [lakers, cowboys].filter(Boolean).map((team) => ({
          team: { connect: { id: team!.id } }
        }))
      }
    },
    include: includeDemoUserRelations()
  });
}
