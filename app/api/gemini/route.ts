import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { prompt, imageData, mediaType } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let result;

        if (imageData && mediaType) {
            // Vision mode — used by NFT Describer demo
            result = await model.generateContent([
                {
                    inlineData: {
                        data: imageData,
                        mimeType: mediaType as string,
                    },
                },
                prompt,
            ]);
        } else {
            // Standard text mode — used by all other demos
            result = await model.generateContent(prompt);
        }

        const text = result.response.text();
        return NextResponse.json({ text });

    } catch (error: unknown) {
        console.error("Gemini API error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
