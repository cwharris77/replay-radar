import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: number;
      role?: "user" | "admin";
      profile?: Profile | null;
    };
  }

  interface User {
    id: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
