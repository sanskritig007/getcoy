import { NextRequest, NextResponse } from "next/server";
import { recordSwipe } from "@/lib/db";
import { SwipeAction } from "@/types";

// POST /api/swipe
// Body: { profileId: string, action: 'like' | 'pass' }
// Returns whether it created a mutual match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, action } = body as {
      profileId?: string;
      action?: SwipeAction;
    };

    if (!profileId || !action) {
      return NextResponse.json(
        { success: false, error: "profileId and action are required" },
        { status: 400 }
      );
    }

    if (action !== "like" && action !== "pass") {
      return NextResponse.json(
        { success: false, error: "action must be 'like' or 'pass'" },
        { status: 400 }
      );
    }

    const { matched, profile } = await recordSwipe(profileId, action);

    return NextResponse.json({
      success: true,
      profileId,
      action,
      matched,
      matchedProfile: profile,
    });
  } catch (error) {
    console.error("Error recording swipe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record swipe" },
      { status: 500 }
    );
  }
}

