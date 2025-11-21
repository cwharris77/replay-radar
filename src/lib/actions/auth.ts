import { signIn, signOut } from "next-auth/react";

export const login = async (callbackUrl = "/") => {
  await signIn("spotify", { callbackUrl });
};

export const logout = async (callbackUrl = "/") => {
  await signOut({
    callbackUrl,
  });
};
