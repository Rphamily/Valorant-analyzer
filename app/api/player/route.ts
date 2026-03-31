import { NextResponse } from "next/server";

const regions = ["na", "eu", "ap", "kr"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");
  const tag = searchParams.get("tag");

  for (const region of regions) {
    try {
      const res = await fetch(
        `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${name}/${tag}`
      );

      const data = await res.json();

      if (data.data) {
        return NextResponse.json({
          name: `${name}#${tag}`,
          rank: data.data.currenttierpatched,
          rr: data.data.ranking_in_tier,
          region: region.toUpperCase(),
        });
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  return NextResponse.json({ error: "Player not found" });
}