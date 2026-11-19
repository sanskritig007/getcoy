import { NextResponse } from "next/server";
import { resetDemoState } from "@/lib/db";

// POST /api/reset
// Resets all swipes and matches so demo can be tested again cleanly
export async function POST() {
  try {
    await resetDemoState();
    return NextResponse.json({
      success: true,
      message: "Demo state has been reset successfully",
    });
  } catch (error) {
    console.error("Error resetting state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset demo state" },
      { status: 500 }
    );
  }
}

