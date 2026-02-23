import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const { name, email, service, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: "Portfolio Form <onboarding@resend.dev>",
            to: ["ali.mora@namka.cloud"],
            subject: `New Enquiry — ${service || "General"} · Namka Portfolio`,
            html: `
        <h2>New Contact Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
        console.error("Resend error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
    }
}
