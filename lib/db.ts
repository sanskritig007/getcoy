import fs from "fs/promises";
import path from "path";
import { AppState, Profile, SwipeAction, Gender } from "@/types";
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
// Supports optional gender / orientation filtering
// PRIVACY CRITICAL: strips 'hasLikedUser' so it is never exposed over the network
export async function getFeedProfiles(filters?: {
  gender?: Gender | "all";
  orientation?: string | "all";
}): Promise<Profile[]> {
  const state = await getAppState();
  const swipedIds = new Set(Object.keys(state.swipes));

  let profiles = MOCK_PROFILES.filter((profile) => !swipedIds.has(profile.id));

  // Apply inclusive filtering if requested
  if (filters?.gender && filters.gender !== "all") {
    profiles = profiles.filter((p) => p.gender === filters.gender);
  }
  if (filters?.orientation && filters.orientation !== "all") {
    if (filters.orientation === "queer-community") {
      // Filter for LGBTQ+ (anything except straight)
      profiles = profiles.filter((p) => p.orientation !== "Straight" || p.gender === "non-binary");
    } else {
      profiles = profiles.filter((p) => p.orientation.toLowerCase() === filters.orientation?.toLowerCase());
    }
  }

  return profiles.map(
    // Sanitize: client only receives public fields
    ({ id, name, age, gender, pronouns, orientation, photo, bio, collegeOrCity, interests }) => ({
      id,
      name,
      age,
      gender,
      pronouns,
      orientation,
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
    gender: targetSeed.gender,
    pronouns: targetSeed.pronouns,
    orientation: targetSeed.orientation,
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
    ({ id, name, age, gender, pronouns, orientation, photo, bio, collegeOrCity, interests }) => ({
      id,
      name,
      age,
      gender,
      pronouns,
      orientation,
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
