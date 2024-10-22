import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Verify Razorpay signature to secure webhooks
export const verifyRazorpaySignature = (req: any) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  return digest === req.headers["x-razorpay-signature"];
};

// Handle subscription updates
export const handleSubscriptionUpdate = async (subscription: any, eventType?: string) => {
  const userId = subscription.notes?.userId; // Assuming userId is passed in notes

  if (!userId) throw new Error("User ID not found in subscription notes");

  // Based on the subscription plan, update the user's status
  const plan = subscription.plan_id;
  let isBasic = false, isPro = false, isMember = false;

  if (plan.includes("plan_PCBYUc5IOqKrMk")) isBasic = true;
  if (plan.includes("plan_PCBYxbyp205KiR")) isPro = true;
  if (plan.includes("plan_PCBZDUlI1fLwSP")) isMember = true;

  // Update the user based on subscription event
  if (eventType === "cancelled") {
    await prisma.user.update({
      where: { id: userId },
      data: { isBasic: false, isPro: false, isMember: false },
    });
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { isBasic, isPro, isMember },
    });

     await prisma.aiGen.update({
      where: { userId: userId },
      data: { 
        count: "1", 
        startDate: new Date(),
      }, 
    });
  }
};

// Handle invoice events (paid or expired)
export const handleInvoiceEvent = async (invoice: any, status: "paid" | "expired") => {
  const userId = invoice.notes?.userId; // Assuming userId is passed in notes

  if (!userId) throw new Error("User ID not found in invoice notes");

  if (status === "paid") {
    const plan = invoice.subscription_id;
    let isBasic = false, isPro = false, isMember = false;

    if (plan.includes("plan_PCBYUc5IOqKrMk")) isBasic = true;
    if (plan.includes("plan_PCBYxbyp205KiR")) isPro = true;
    if (plan.includes("plan_PCBZDUlI1fLwSP")) isMember = true;

    // Extend the subscription for another cycle (30 days)
    await prisma.user.update({
      where: { id: userId },
      data: {
        isBasic,
        isPro,
        isMember,
        updatedAt: new Date(),
      },
    });

    await prisma.aiGen.update({
      where: { userId: userId },
      data: { 
        count: "1", 
        startDate: new Date(),
      }, 
    });

  } else if (status === "expired") {
    // Expire the subscription
    await prisma.user.update({
      where: { id: userId },
      data: {
        isBasic: false,
        isPro: false,
        isMember: false,
      },
    });
  }
};
