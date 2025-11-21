import { getServerAuthData } from "@/lib/serverAuth";

export async function GET() {
  const { session } = await getServerAuthData();
  console.log(session);
  return new Response(JSON.stringify(session, null, 2));
}
