import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 🔍 DEBUG: check if API key exists
    console.log("ENV KEY:", process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        answer: "❌ API key not found. Check .env.local",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const { question, stats } = body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional Valorant coach. Give short, helpful advice.",
        },
        {
          role: "user",
          content: `Stats: ${JSON.stringify(stats)} \n Question: ${question}`,
        },
      ],
    });

    return NextResponse.json({
      answer: response.choices[0].message.content,
    });

  } catch (error: any) {
    console.error("🔥 FULL ERROR:", error);

    return NextResponse.json({
      answer: "❌ AI failed — check terminal",
    });
  }
}