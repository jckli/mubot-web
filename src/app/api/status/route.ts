import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.TSUUCHI_API_SECRET;
    
    if (!apiKey) {
      console.error("Missing TSUUCHI_API_SECRET environment variable");
      return NextResponse.json(
        { error: "Server Configuration Error" },
        { status: 500 }
      );
    }

    const res = await fetch('https://rsmapi.hayasaka.moe/tsuuchi/status', {
      headers: {
        'x-api-key': apiKey,
      },
      next: { revalidate: 5 }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
