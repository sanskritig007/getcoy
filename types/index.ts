export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  collegeOrCity: string;
  interests: string[];
}

export interface SeedProfile extends Profile {
  hasLikedUser: boolean; // Secret backend-only flag (never leaked to client)
}

export type SwipeAction = "like" | "pass";

export interface SwipeRecord {
  profileId: string;
  action: SwipeAction;
  timestamp: string;
}

export interface MatchRecord {
  profileId: string;
  matchedAt: string;
}

export interface AppState {
  swipes: Record<string, SwipeAction>; // profileId -> "like" | "pass"
  matches: string[]; // array of profileIds that are mutual matches
}

