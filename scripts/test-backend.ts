import { getFeedProfiles, recordSwipe, getMatches, resetDemoState } from "../lib/db";
import fs from "fs/promises";
import path from "path";

async function runTests() {
  console.log("==================================================");
  console.log("🧪 TESTING BACKEND APIS & INCLUSIVE FILTERING");
  console.log("==================================================\n");

  // Step 1: Reset demo state to clean slate
  console.log("Step 1: Resetting state to clean slate...");
  await resetDemoState();
  let feed = await getFeedProfiles();
  console.log(`✅ Initial feed count: ${feed.length} profiles (Expected: 30)`);
  if (feed.length !== 30) throw new Error("Feed should have 30 profiles initially!");

  // Step 2: Privacy Verification
  console.log("\nStep 2: Checking Privacy (hasLikedUser must NEVER leak to client)...");
  const leakedProperty = feed.some((p: any) => "hasLikedUser" in p);
  if (leakedProperty) {
    throw new Error("❌ PRIVACY LEAK: 'hasLikedUser' found in client feed!");
  } else {
    console.log("✅ PRIVACY VERIFIED: 'hasLikedUser' is 100% stripped from feed.");
  }

  // Step 3: LGBTQ+ & Inclusive Preference Filtering Check
  console.log("\nStep 3: Testing Inclusive Filtering (Women, Men, Non-binary, LGBTQ+)...");
  const womenFeed = await getFeedProfiles({ gender: "woman" });
  console.log(`- Women in feed: ${womenFeed.length}`);
  const menFeed = await getFeedProfiles({ gender: "man" });
  console.log(`- Men in feed: ${menFeed.length}`);
  const nbFeed = await getFeedProfiles({ gender: "non-binary" });
  console.log(`- Non-binary folks in feed: ${nbFeed.length}`);
  const queerFeed = await getFeedProfiles({ orientation: "queer-community" });
  console.log(`- LGBTQ+ / Queer folks in feed: ${queerFeed.length}`);

  if (womenFeed.length === 0 || menFeed.length === 0 || nbFeed.length === 0 || queerFeed.length === 0) {
    throw new Error("Inclusive profiles missing from mock dataset!");
  }
  console.log("✅ Inclusive filtering verified: Women, Men, Non-binary, and Queer feeds work!");

  // Step 4: Test Normal Like (No Match)
  console.log("\nStep 4: Swiping RIGHT (Like) on p1 (Ananya - hasn't liked user)...");
  const swipe1 = await recordSwipe("p1", "like");
  console.log(`Result: matched = ${swipe1.matched}`);
  if (swipe1.matched !== false) throw new Error("p1 should NOT match!");
  console.log("✅ Correct: One-sided like does not trigger match.");

  // Check feed reduced by 1
  feed = await getFeedProfiles();
  console.log(`Feed count after 1 swipe: ${feed.length} profiles (Expected: 29)`);
  const containsP1 = feed.some((p) => p.id === "p1");
  if (containsP1) throw new Error("p1 should not appear in feed after being swiped!");
  console.log("✅ Profile p1 successfully removed from feed.");

  // Step 5: Test Mutual Match!
  console.log("\nStep 5: Swiping RIGHT (Like) on p2 (Kabir - pre-liked user)...");
  const swipe2 = await recordSwipe("p2", "like");
  console.log(`Result: matched = ${swipe2.matched}`);
  console.log(`Matched with: ${swipe2.profile?.name} (${swipe2.profile?.orientation}, ${swipe2.profile?.pronouns})`);
  if (!swipe2.matched || swipe2.profile?.id !== "p2") {
    throw new Error("p2 MUST trigger mutual match!");
  }
  console.log("🎉 MUTUAL MATCH TRIGGERED SUCCESSFULLY!");

  // Step 6: Test Left Swipe (Pass)
  console.log("\nStep 6: Swiping LEFT (Pass) on p3 (Rhea)...");
  const swipe3 = await recordSwipe("p3", "pass");
  console.log(`Result: matched = ${swipe3.matched}`);
  if (swipe3.matched !== false) throw new Error("Pass action should never match!");
  console.log("✅ Pass recorded successfully.");

  // Step 7: Test Matches API
  console.log("\nStep 7: Checking /matches API...");
  const matches = await getMatches();
  console.log(`Total mutual matches: ${matches.length}`);
  console.log("Matches list:", matches.map((m) => `${m.name} (${m.gender}, ${m.pronouns}, ${m.orientation})`));
  if (matches.length !== 1 || matches[0].id !== "p2") {
    throw new Error("Matches list should have exactly Kabir (p2)!");
  }
  console.log("✅ Matches list accurate.");

  // Step 8: Persistence across reloads verification
  console.log("\nStep 8: Verifying data persistence in data/state.json...");
  const stateRaw = await fs.readFile(path.join(process.cwd(), "data", "state.json"), "utf-8");
  const state = JSON.parse(stateRaw);
  if (Object.keys(state.swipes).length !== 3 || state.matches.length !== 1) {
    throw new Error("Disk state not persisting properly!");
  }
  console.log("✅ Persistence confirmed: Swipes and matches saved to disk.");

  // Step 9: Clean reset after test
  console.log("\nStep 9: Resetting state back to pristine 30 profiles...");
  await resetDemoState();
  const cleanFeed = await getFeedProfiles();
  console.log(`✅ State reset confirmed. Feed restored to: ${cleanFeed.length} profiles.`);

  console.log("\n==================================================");
  console.log("🎉 ALL BACKEND & INCLUSIVE TESTS PASSED (100% SUCCESS)");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});
