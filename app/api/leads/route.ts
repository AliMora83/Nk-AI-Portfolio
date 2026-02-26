import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { url, result, email } = await req.json();

        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON || '{}'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const row = [
            new Date().toISOString(),
            url || '',
            result?.siteName || '',
            result?.siteType || '',
            result?.overallScore || '',
            result?.grade || '',
            result?.scores?.design || '',
            result?.scores?.copy || '',
            result?.scores?.ux || '',
            result?.scores?.seo || '',
            result?.scores?.conversion || '',
            result?.scores?.mobile || '',
            result?.roastLine || '',
            result?.kills?.[0] || '',
            result?.kills?.[1] || '',
            result?.bigMove || '',
            'New Lead',
            '',
            email || '',
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:S',
            valueInputOption: 'RAW',
            requestBody: { values: [row] },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        // Always fail silently — never break the roast experience
        console.error('Lead capture error:', error);
        return NextResponse.json({ success: false });
    }
}
