function getColor(count: number) {
  if (count === 0) return "bg-gray-800";
  if (count < 3) return "bg-green-900";
  if (count < 6) return "bg-green-700";
  if (count < 12) return "bg-green-500";
  return "bg-green-300";
}

interface Grid {
  day: string;
  count: number;
}

export default function StatsHeatmap({ grid }: { grid: Grid[][] }) {
  return (
    <div className='flex gap-1 overflow-x-auto py-6'>
      {grid.map((week, w) => (
        <div key={w} className='flex flex-col gap-1'>
          {week.map((day, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-sm ${getColor(
                day.count
              )} relative group`}
            >
              {/* tooltip */}
              <div className='absolute left-6 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap'>
                {day.count} plays on {day.day}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
