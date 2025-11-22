export default function TrendsOverviewPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold text-foreground mb-4'>Your Trends</h1>
      <p className='text-muted-foreground mb-6'>
        Explore your listening trends—artists, tracks, genres, and more.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <h2 className='text-lg font-semibold mb-2'>Artists</h2>
          <p className='text-muted-foreground text-sm'>
            View daily artist ranking trends.
          </p>
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <h2 className='text-lg font-semibold mb-2'>Tracks</h2>
          <p className='text-muted-foreground text-sm'>
            See your most played songs over time.
          </p>
        </div>

        <div className='bg-card border border-border rounded-xl p-4'>
          <h2 className='text-lg font-semibold mb-2'>Genres</h2>
          <p className='text-muted-foreground text-sm'>
            Discover genre shifts in your listening.
          </p>
        </div>
      </div>
    </div>
  );
}
