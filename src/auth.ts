import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import {prisma} from "@/lib/prisma";


import type { NextAuthConfig } from "next-auth";

import Google from "next-auth/providers/google";

import { getUserById } from "./lib/auth";
import { getAccountByUserId } from "./lib/auth";
import { createUsername } from "@/lib/utils";

export const authConfig = {

  events: {
      async signIn({isNewUser, user, account}){
        if (account?.provider !== "credentials") {
        if (isNewUser) {
          let newUsername = createUsername(user?.name ?? "user", user?.email ?? "");
          let isUnique = false;

          while (!isUnique) {
            const userWithSameUsername = await prisma.user.findUnique({
              where: { username: newUsername }
            });
            if (!userWithSameUsername) {
              isUnique = true;
            } else {
              newUsername = createUsername(user?.name ?? "user", user?.email ?? "");
            }
          }

          await prisma.user.update({
            where: { id: user?.id },
            data: { username: newUsername }
          });

        }
      }
    },

    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

  ],

  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await getUserById(user.id!);
     
      if ((existingUser && !existingUser.username)) {
        let newUsername = createUsername(user?.name ?? "user", user?.email ?? "");
        let isUnique = false;

        while (!isUnique) {
          const userWithSameUsername = await prisma.user.findUnique({
            where: { username: newUsername }
          });
          if (!userWithSameUsername) {
            isUnique = true;
          } else {
            newUsername = createUsername(user?.name ?? "user", user?.email ?? "");
          }
        }

        await prisma.user.update({
          where: { id: user?.id },
          data: { username: newUsername }
        });

      }

      // Allow OAuth without email verification
      if (account?.provider === "google") {
        return true;
      }


      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;


      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

  
      if (session.user) {
        session.user.name = token.name;
        session.user.username = token.username;
        session.user.email = token.email!;
        session.user.image = token.image as string;
        session.user.isAdmin= token.isAdmin as boolean;
        session.user.isPrivate= token.isPrivate as boolean;
        session.user.isBasic= token.isBasic as boolean;
        session.user.isPro= token.isPro as boolean;
        session.user.isMember= token.isMember as boolean;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.username = existingUser.username;

      token.isAdmin= existingUser.isAdmin;
      token.isPrivate= existingUser.isPrivate;
      token.isBasic= existingUser.isBasic;
      token.isPro= existingUser.isPro;
      token.isMember= existingUser.isMember;

      token.email = existingUser.email;
      token.image = existingUser.image;

      return token;
    },
  },

  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig;



export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig
});
