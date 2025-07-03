import TopTracks from "../../components/TopTracks";

export default function TopTracksPage() {
  return (
    <main className='min-h-screen bg-gray-900 text-white p-6'>
      <h1 className='text-3xl font-bold mb-6'>Your Top Tracks</h1>
      <TopTracks />
    </main>
  );
}
