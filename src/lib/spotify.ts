import cookie from 'cookie';
import { NextApiRequest } from 'next/dist/shared/lib/utils';

export async function fetchSpotifyData(req: NextApiRequest, endpoint: string) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.spotify_access_token;

  if (!accessToken) {
    throw new Error('No access token');
  }

  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Spotify API error');
  }

  return res.json();
}
