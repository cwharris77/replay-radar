import { authOptions } from "@/auth/authOptions";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

export async function getTypedServerSession(): Promise<Session | null> {
  const session = (await getServerSession(authOptions)) as Session | null;
  return session;
}
