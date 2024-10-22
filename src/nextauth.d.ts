

export type ExtendedUser = DefaultSession["user"] & {
    username?: string | null
    isAdmin: boolean
    isBasic:boolean
    isPro: boolean
    isMember: boolean
    isPrivate: boolean,
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}