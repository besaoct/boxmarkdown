"use server";

import { prisma } from "@/lib/prisma";
import { currentUser, currentUserPlan } from "@/lib/auth";
import { plans } from "@/lib/plan";

export const countAIGens = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const currentPlan = await currentUserPlan();

  // Fetch the current AI generation count and startDate
  const aiRecord = await prisma.aiGen.findUnique({
    where:{
     userId: user.id
    }
   })

  // If no record is found, create a new one
  if (!aiRecord) {
    const firstAIrecord =  await prisma.aiGen.create({
      data: {
        userId: user.id,
        count: "1",
        startDate: new Date(),
      },
    });
    
    return {aiCount: firstAIrecord.count, success: "AI generation count initialized!"};
  }


  const aiGenCount = Number(aiRecord?.count || 0);
  const startDate = aiRecord?.startDate ? new Date(aiRecord.startDate) : new Date();
  // Calculate the number of days since the startDate
  const currentDate = new Date();
  const durationInMillis = currentDate.getTime() - startDate.getTime();
  const durationInDays = Math.floor(durationInMillis / (1000 * 60 * 60 * 24)); // Convert ms to days


  if ((durationInDays >= 30)) {
    // Reset count and adjust startDate
    const exceededDays = durationInDays - 30;
    const newStartDate = new Date(startDate.getTime() - (exceededDays * (1000 * 60 * 60 * 24))); // Adjust startDate
    
    const restartAIrecord= await prisma.aiGen.update({
      where: { userId: user.id },
      data: { 
        count: "1", 
        startDate: newStartDate,
      }, 
    });

    return { aiCount: restartAIrecord.count, success: "AI generation count reset due to exceeding 30 days"};
  }


// Check the limit based on the current plan
const planLimits = {
  Free: plans.free.numberOfAIgens,
  Basic: plans.basic.numberOfAIgens,
  Pro: plans.pro.numberOfAIgens,
  Member: plans.member.numberOfAIgens,
};
if (aiGenCount >= planLimits[currentPlan]) {
  return { error: `Please upgrade your plan: ${currentPlan}` };
}


  const updatedCount = String(aiGenCount + 1);
  // Increment AI generation count
  const updatedAIgen = await prisma.aiGen.update({
    where: { userId: user.id },
    data: { 
      count: updatedCount,
      daysLeftCount: `${String(30 - durationInDays)}`,
    },
  });

  return { aiCount: updatedAIgen.count, success: "Number of AI generations incremented!" };
};
