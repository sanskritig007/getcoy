import fs from "fs/promises";
import path from "path";
import { AppState, Profile, SwipeAction } from "@/types";
import { MOCK_PROFILES } from "@/data/mockProfiles";

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");

const INITIAL_STATE: AppState = {
  swipes: {},
  matches: [],
};

// Helper to ensure data directory exists and read state
export async function getAppState(): Promise<AppState> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await fs.readFile(STATE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, create it with initial state
    await saveAppState(INITIAL_STATE);
    return { ...INITIAL_STATE };
  }
}

// Helper to write state to file
export async function saveAppState(state: AppState): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// Get feed profiles (excluding any profile the user has already swiped)
// PRIVACY CRITICAL: strips 'hasLikedUser' so it is never exposed over the network
export async function getFeedProfiles(): Promise<Profile[]> {
  const state = await getAppState();
  const swipedIds = new Set(Object.keys(state.swipes));

  return MOCK_PROFILES.filter((profile) => !swipedIds.has(profile.id)).map(
    // Sanitize: client only receives public fields
    ({ id, name, age, photo, bio, collegeOrCity, interests }) => ({
      id,
      name,
      age,
      photo,
      bio,
      collegeOrCity,
      interests,
    })
  );
}

// Record a swipe (like or pass) and compute mutual match
export async function recordSwipe(
  profileId: string,
  action: SwipeAction
): Promise<{ matched: boolean; profile?: Profile }> {
  const state = await getAppState();
  const targetSeed = MOCK_PROFILES.find((p) => p.id === profileId);

  if (!targetSeed) {
    throw new Error(`Profile ${profileId} not found`);
  }

  // Record the swipe
  state.swipes[profileId] = action;

  let matched = false;

  // Mutual match condition:
  // 1. Current user swiped 'like'
  // 2. Target profile had already liked current user (hasLikedUser === true)
  if (action === "like" && targetSeed.hasLikedUser) {
    matched = true;
    if (!state.matches.includes(profileId)) {
      state.matches.push(profileId);
    }
  }

  await saveAppState(state);

  const sanitizedProfile: Profile = {
    id: targetSeed.id,
    name: targetSeed.name,
    age: targetSeed.age,
    photo: targetSeed.photo,
    bio: targetSeed.bio,
    collegeOrCity: targetSeed.collegeOrCity,
    interests: targetSeed.interests,
  };

  return { matched, profile: matched ? sanitizedProfile : undefined };
}

// Get all mutual matched profiles
export async function getMatches(): Promise<Profile[]> {
  const state = await getAppState();
  const matchIdSet = new Set(state.matches);

  return MOCK_PROFILES.filter((p) => matchIdSet.has(p.id)).map(
    ({ id, name, age, photo, bio, collegeOrCity, interests }) => ({
      id,
      name,
      age,
      photo,
      bio,
      collegeOrCity,
      interests,
    })
  );
}

// Reset demo state so testing can be repeated easily
export async function resetDemoState(): Promise<void> {
  await saveAppState(INITIAL_STATE);
}

