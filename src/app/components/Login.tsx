"use client";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <button
      onClick={() => signIn("spotify")}
      className='p-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition'
    >
      Login with Spotify
    </button>
  );
};

export default Login;
