export type Gender = "woman" | "man" | "non-binary";

export type Pronouns = "she/her" | "he/him" | "they/them";

export type Orientation =
  | "Straight"
  | "Lesbian"
  | "Gay"
  | "Bisexual"
  | "Queer"
  | "Pansexual"
  | "Asexual";

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  pronouns: Pronouns;
  orientation: Orientation;
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

export interface FeedFilter {
  gender?: Gender | "all";
  orientation?: string | "all";
}
