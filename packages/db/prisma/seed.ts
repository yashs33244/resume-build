// prisma/seed.ts
import { PrismaClient, SubscriptionDuration } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create the 30-day plan
  await prisma.subscriptionPlan.upsert({
    where: { id: '30-day-plan' },
    update: {},
    create: {
      id: '30-day-plan',
      name: '30 Day Plan',
      duration: SubscriptionDuration.THIRTY_DAYS,
      price: 199,
      description: 'Access to premium features for 30 days',
      features: [
        'PDF downloads',
        'Premium templates',
        'Priority support',
        'Ad-free experience'
      ]
    }
  });

  // Create the 90-day plan
  await prisma.subscriptionPlan.upsert({
    where: { id: '90-day-plan' },
    update: {},
    create: {
      id: '90-day-plan',
      name: '90 Day Plan',
      duration: SubscriptionDuration.NINETY_DAYS,
      price: 499,
      description: 'Access to premium features for 90 days',
      features: [
        'PDF downloads',
        'Premium templates',
        'Priority support',
        'Ad-free experience',
        'Advanced analytics'
      ]
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });