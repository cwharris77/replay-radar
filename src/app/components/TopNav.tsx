"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import Login from "./Login";
import Logout from "./Logout";

const TopNav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className='flex items-center justify-between w-full p-4'>
      <Link
        href='/'
        className='text-4xl font-bold text-white gap-x-2 flex items-center'
      >
        <Image
          src='/replay_radar_logo.svg'
          alt='Replay Radar Logo'
          width={40}
          height={40}
          className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-green-500'
        />
        Replay Radar
      </Link>
      <div className='gap-x-4 flex items-center'>
        <Link
          href='/artists'
          className='text-2xl text-gray-300 hover:text-white'
        >
          Artists
        </Link>
        {!isAuthenticated ? <Login /> : <Logout />}
      </div>
    </nav>
  );
};

export default TopNav;
