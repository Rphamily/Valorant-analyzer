import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name") || "Unknown";
  const tag = searchParams.get("tag") || "NA1";

  return NextResponse.json({
    name: `${name}#${tag}`,
  });
}