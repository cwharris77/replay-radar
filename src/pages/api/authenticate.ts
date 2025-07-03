import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export async function authenticate(
  req: NextApiRequest,
  res?: NextApiResponse
): Promise<string | null> {
  const cookies = cookie.parse(req.headers.cookie || "");
  const accessToken = cookies.spotify_access_token;
  const refreshToken = cookies.spotify_refresh_token;

  if (!accessToken && refreshToken && res) {
    return await refreshAndReturnToken(refreshToken, res);
  }

  if (accessToken) {
    const meRes = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (meRes.ok) {
      return accessToken;
    }

    if (meRes.status === 401 && refreshToken && res) {
      return await refreshAndReturnToken(refreshToken, res);
    }
  }

  return null;
}

async function refreshAndReturnToken(
  refreshToken: string,
  res: NextApiResponse
): Promise<string | null> {
  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      }
    );

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("spotify_access_token", tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: tokenData.expires_in,
          path: "/",
          sameSite: "lax",
        })
      );

      return tokenData.access_token;
    } else {
      const errorData = await tokenResponse.json();
      console.error("Token refresh failed:", errorData);
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
  }

  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = await authenticate(req, res);

  if (accessToken) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
}
