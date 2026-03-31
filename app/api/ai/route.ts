import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Return ONLY JSON:

{
  "action": "add_player",
  "players": [{ "name": "", "tag": "" }]
}
`,
        },
        {
          role: "user",
          content: body.message,
        },
      ],
    });

    const text = response.choices[0].message.content || "{}";

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI failed" });
  }
}