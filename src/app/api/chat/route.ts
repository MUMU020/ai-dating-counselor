import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ response: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "system", content: "당신은 연애 상담 전문가입니다." }, { role: "user", content: message }],
      }),
    });

    const data = await res.json();
    return NextResponse.json({ response: data.choices[0]?.message?.content || "답변을 가져올 수 없습니다." });
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return NextResponse.json({ response: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
