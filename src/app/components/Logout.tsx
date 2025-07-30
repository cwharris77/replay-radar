import { useNextAuth } from "../hooks/useNextAuth";

export const Logout = () => {
  const { logout } = useNextAuth();

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
