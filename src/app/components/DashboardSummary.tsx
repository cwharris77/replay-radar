import { Artist } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparklines, SparklinesLine } from "react-sparklines";

interface DashboardSummaryProps {
  topArtist: Artist;
  totalMinutes: number;
  trendData: number[];
}

export default function DashboardSummary({
  topArtist,
  totalMinutes,
  trendData,
}: DashboardSummaryProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {/* Top Artist Stat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 shadow-lg text-white'
      >
        <p className='text-sm text-white/80 mb-1'>Top Artist This Year</p>
        <p className='text-2xl font-bold'>{topArtist.name || "N/A"}</p>
      </motion.div>

      {/* Total Minutes Stat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg text-white'
      >
        <p className='text-sm text-white/80 mb-1'>Total Minutes Listened</p>
        <p className='text-2xl font-bold'>{totalMinutes.toLocaleString()}</p>
      </motion.div>

      {/* Recent Trend Sparkline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className='p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg text-white'
      >
        <p className='text-sm text-white/80 mb-2'>Recent Listening Trend</p>
        <Sparklines
          data={trendData}
          limit={20}
          width={100}
          height={30}
          margin={5}
        >
          <SparklinesLine color='white' style={{ fill: "none" }} />
        </Sparklines>
      </motion.div>

      {/* View Top Artists Card Link */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className='p-6 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-700 shadow-lg text-white flex items-center justify-center'
      >
        <Link href='/artists' className='font-bold text-lg'>
          View Top Artists
        </Link>
      </motion.div>
    </div>
  );
}
