import TopArtists from "../../components/TopArtists";

export default function TopArtistsPage() {
  return (
    <main className='min-h-screen bg-gray-900 text-white p-6'>
      <h1 className='text-3xl font-bold mb-6'>Your Top Artists</h1>
      <TopArtists />
    </main>
  );
}
