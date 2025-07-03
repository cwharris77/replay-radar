import { useAuth } from "../hooks/useAuth";

export const Logout = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className='p-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition'
    >
      Logout
    </button>
  );
};

export default Logout;
