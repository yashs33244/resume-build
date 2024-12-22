// utils/subscription.ts
import { PrismaClient, SubscriptionStatus, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface SubscriptionParams {
  userId: string;
  planId: string;
  paymentId: string;
  orderId: string;
}

export async function createSubscription(params: SubscriptionParams) {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: params.planId }
  });

  if (!plan) {
    throw new Error('Invalid subscription plan');
  }

  // Calculate end date based on plan duration
  const startDate = new Date();
  const endDate = new Date(startDate);
  if (plan.duration === 'THIRTY_DAYS') {
    endDate.setDate(endDate.getDate() + 30);
  } else if (plan.duration === 'NINETY_DAYS') {
    endDate.setDate(endDate.getDate() + 90);
  }

  // Create subscription and update user status
  const subscription = await prisma.$transaction([
    prisma.userSubscription.create({
      data: {
        userId: params.userId,
        planId: params.planId,
        startDate,
        endDate,
        status: SubscriptionStatus.ACTIVE,
      }
    }),
    prisma.user.update({
      where: { id: params.userId },
      data: { status: UserStatus.PAID }
    })
  ]);

  return subscription;
}

export async function checkSubscriptionStatus(userId: string) {
  const activeSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gt: new Date() // End date is in the future
      }
    },
    include: {
      plan: true
    }
  });

  if (!activeSubscription) {
    // Update user status to FREE if no active subscription
    await prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.FREE }
    });
    return null;
  }

  return activeSubscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await prisma.userSubscription.update({
    where: { id: subscriptionId },
    data: { status: SubscriptionStatus.CANCELLED }
  });

  // Check if user has any other active subscriptions
  const hasActiveSubscriptions = await prisma.userSubscription.findFirst({
    where: {
      userId: subscription.userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gt: new Date()
      }
    }
  });

  if (!hasActiveSubscriptions) {
    // Update user status to FREE if no active subscriptions
    await prisma.user.update({
      where: { id: subscription.userId },
      data: { status: UserStatus.FREE }
    });
  }

  return subscription;
}