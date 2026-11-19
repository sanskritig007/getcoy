import { NextRequest, NextResponse } from "next/server";
import { getFeedProfiles } from "@/lib/db";
import { Gender } from "@/types";

// GET /api/feed?gender=woman|man|non-binary|all&orientation=...
// Returns profiles the user has not yet swiped on, with optional inclusive filtering
// PRIVACY: Never leaks 'hasLikedUser' or like state
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = (searchParams.get("gender") || "all") as Gender | "all";
    const orientation = searchParams.get("orientation") || "all";

    const profiles = await getFeedProfiles({ gender, orientation });
    return NextResponse.json({
      success: true,
      count: profiles.length,
      filters: { gender, orientation },
      profiles,
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feed profiles" },
      { status: 500 }
    );
  }
}
