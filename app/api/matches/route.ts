import { NextResponse } from "next/server";
import { getMatches } from "@/lib/db";

// GET /api/matches
// Returns list of mutual matches
export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

