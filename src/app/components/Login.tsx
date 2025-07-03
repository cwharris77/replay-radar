"use client";

import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  return (
    <button
      onClick={login}
      className='p-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition'
    >
      Login with Spotify
    </button>
  );
};

export default Login;
