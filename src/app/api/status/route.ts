import { NextResponse } from 'next/server';
import { tsuuchiApiSecret, tsuuchiBase } from "../../../lib/env";

export async function GET() {
  try {
    const res = await fetch(`${tsuuchiBase()}/status`, {
      headers: {
        'x-api-key': tsuuchiApiSecret(),
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
