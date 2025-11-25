import { LoginPrompt } from "@/components";
import { getServerAuthData } from "@/lib/serverAuth";
import TopArtists from "./components/TopArtists";

export default async function TopArtistsPage() {
  const { isAuthenticated } = await getServerAuthData();

  if (!isAuthenticated) {
    return (
      <main className='min-h-screen text-foreground p-6'>
        <h1 className='text-3xl font-bold mb-6'>Your Top Artists</h1>
        <LoginPrompt
          title='Login to View Your Top Artists'
          message='Connect your Spotify account to see your most listened to artists.'
        />
      </main>
    );
  }

  return (
    <main className='min-h-screen text-foreground p-6'>
      <h1 className='text-3xl font-bold mb-6'>Your Top Artists</h1>
      <TopArtists />
    </main>
  );
}
