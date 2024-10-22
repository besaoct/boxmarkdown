"use server";

import * as z from "zod";

import {prisma } from "@/lib/prisma";
import { SettingsSchema } from "@/schemas";
import {  getUserById, getUserByUsername } from "@/lib/auth";
import { currentUser } from "@/lib/auth";
import { update } from "@/auth";
import { createUsername } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  // Ensure the username does not contain spaces or special characters
let newUsername = values.username?.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

if ((newUsername==='') || !newUsername) {
  newUsername = createUsername(values.name ?? "user", values.email ?? "");
  let isUnique = false;

  while (!isUnique) {
    const userWithSameUsername = await prisma.user.findUnique({
      where: { username: newUsername }
    });
    if (!userWithSameUsername) {
      isUnique = true;
    } else {
      newUsername = createUsername(values.name ?? "user", values.email ?? "");
    }
  }
}

if (newUsername.length > 16) {
newUsername = newUsername.slice(0, 16);
}


if (newUsername && (newUsername !== user.username)) {
  const existingUserByUsername = await getUserByUsername(newUsername);
  if (existingUserByUsername) {
    return { error: "Username already in use!" };
  }
}


  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
      username: newUsername
    }
  });

  update({
    user: {
      name: updatedUser.name,
      username: updatedUser.username,
    }
  });
  
  revalidatePath('/')
  return { updatedUser, success: "Settings saved!" }
}