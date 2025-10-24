import { signOut } from "next-auth/react";
import { Button } from "./ui";

export const Logout = () => {
  return (
    <Button variant='logout' onClick={() => signOut({ callbackUrl: "/" })}>
      Logout
    </Button>
  );
};

export default Logout;
