// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const client_id = process.env.SPOTIFY_CLIENT_ID!;
  const redirect_uri = "http://127.0.0.1:3000/api/callback"; // Must match exactly in your Spotify app
  const scope =
    "user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state";

  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
    });

  return NextResponse.redirect(authUrl);
}
