import { LoginPrompt } from "@/components";
import { getServerAuthData } from "@/lib/serverAuth";
import TopTracks from "./components/TopTracks";

export default async function TopTracksPage() {
  const { isAuthenticated } = await getServerAuthData();

  if (!isAuthenticated) {
    return (
      <main className='min-h-screen text-foreground p-6'>
        <h1 className='text-3xl font-bold mb-6'>Your Top Tracks</h1>
        <LoginPrompt
          title='Login to View Your Top Tracks'
          message='Connect your Spotify account to see your most listened to tracks.'
        />
      </main>
    );
  }

  return (
    <main className='min-h-screen text-foreground p-6'>
      <h1 className='text-3xl font-bold mb-6'>Your Top Tracks</h1>
      <TopTracks />
    </main>
  );
}
