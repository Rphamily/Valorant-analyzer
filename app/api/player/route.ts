import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");
  const tag = searchParams.get("tag");

  try {
    const res = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/mmr/na/${name}/${tag}`,
      {
        headers: {
          Authorization: process.env.HENRIK_API_KEY!,
        },
      }
    );

    const data = await res.json();

    if (!data.data) {
      return NextResponse.json({ error: "Player not found" });
    }

    return NextResponse.json({
      name: `${name}#${tag}`,
      rank: data.data.currenttierpatched,
      rr: data.data.ranking_in_tier,
    });

  } catch {
    return NextResponse.json({ error: "API failed" });
  }
}