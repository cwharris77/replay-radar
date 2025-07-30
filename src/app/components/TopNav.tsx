"use client";

import Image from "next/image";
import Link from "next/link";
import { useNextAuth } from "../hooks/useNextAuth";
import Login from "./Login";
import Logout from "./Logout";

const TopNav = () => {
  const { isAuthenticated } = useNextAuth();

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
      <div className='flex items-center gap-x-4'>
        {isAuthenticated && (
          <div className='gap-x-4 flex items-center'>
            <Link
              href='/pages/artists'
              className='text-2xl text-gray-300 hover:text-white'
            >
              Artists
            </Link>
            <Link
              href='/pages/tracks'
              className='text-2xl text-gray-300 hover:text-white'
            >
              Tracks
            </Link>

            <Link
              href='/pages/about'
              className='text-2xl text-gray-300 hover:text-white'
            >
              About
            </Link>
          </div>
        )}
        {!isAuthenticated ? <Login /> : <Logout />}
      </div>
    </nav>
  );
};

export default TopNav;
