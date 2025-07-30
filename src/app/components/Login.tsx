"use client";

import { useNextAuth } from "../hooks/useNextAuth";

const Login = () => {
  const { login } = useNextAuth();
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
