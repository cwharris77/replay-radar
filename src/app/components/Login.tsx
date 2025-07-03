"use client";

const handleLogin = () => {
  window.location.href = "/api/login";
};

const Login = () => {
  return (
    <button
      onClick={handleLogin}
      className='px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition'
    >
      Login with Spotify
    </button>
  );
};

export default Login;
