import { auth } from "@/auth";
import {prisma} from "@/lib/prisma";
import { cache } from "react";

export const currentUser = cache(async () => {
  const session = await auth();
  const user = (session?.user);
  return user;
});

export const getUserId = cache(async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("You must be signed in to use this feature");
  }

  return userId;
});

export const currentUserPlan = cache(async () => {
  const cUser = await currentUser();
  const user = await getUserById(cUser?.id);

  const currentPlan = user?.isBasic ? 'Basic' : user?.isPro ? 'Pro' : user?.isMember? 'Member' : 'Free';
  
  return currentPlan;
});

export const getTotalAIgens = cache(async () => {
  const user = await currentUser()
  try {
    const data = await prisma.aiGen.findUnique({ 
      where: { 
        userId:user.id
      } 
    });
    return data?.count ? Number(data.count) : 0;
  } catch {
    return 0;
  }
});


export const getUserByEmail = cache(async (email: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
  
      return user;
    } catch {
      return null;
    }
  });
  
  export const getUserById = cache(async (id: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
  
      return user;
    } catch {
      return null;
    }
  });

  export const getUserByUsername = cache(async (username: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
  
      return user;
    } catch {
      return null;
    }
  });


  export const getAccountByUserId = cache(async (userId: string) => {
    try {
      const account = await prisma.account.findFirst({
        where: { userId }
      });
  
      return account;
    } catch {
      return null;
    }
  });
