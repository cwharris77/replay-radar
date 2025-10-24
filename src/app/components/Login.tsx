"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui";

const Login = () => {
  return (
    <Button onClick={() => signIn("spotify")} variant='primary'>
      Login with Spotify
    </Button>
  );
};

export default Login;
