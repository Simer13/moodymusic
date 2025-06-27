// src/app/api/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const client_id = process.env.SPOTIFY_CLIENT_ID!;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirect_uri = "http://127.0.0.1:3000/api/callback";

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code || "",
    redirect_uri,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await res.json();

  const access_token = data.access_token;

  return NextResponse.redirect(`http://127.0.0.1:3000/?token=${access_token}`);
}
