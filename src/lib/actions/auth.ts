import { signIn, signOut } from "next-auth/react";

export const login = async () => {
  await signIn("spotify", { callbackUrl: "/" });
};

export const logout = async () => {
  await signOut({
    callbackUrl: "/",
  });
};
