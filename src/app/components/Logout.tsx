import { signOut } from "next-auth/react";

export const Logout = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className='p-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition'
    >
      Logout
    </button>
  );
};

export default Logout;
