"use client";

const handleLogin = () => {
    window.location.href = '/api/login';
};

const Login = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Welcome to Your Spotify Wrapped</h1>
      <button
        onClick={handleLogin}
        className="mt-8 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
