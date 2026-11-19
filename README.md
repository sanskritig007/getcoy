# Coy SDE Intern Assignment — "Discover" Tab & App Analysis

> A full-stack swipe-based discovery experience built for **Coy**, featuring privacy-first mutual matching, inclusive LGBTQ+ profiles, smooth card drag gestures, and state persistence.

---

## 📌 Part A: App Teardown & Suggested Core Features

After testing the Coy live app (`https://app.getcoy.com`) — including OTP login, adding crushes, email verification, referral invite links, and the extra slots flow — here are two core features proposed to solve key user pain points and drive viral retention:

---

### Feature 1: Contextual Anonymous Clues (Curiosity Hook)

* **What it is:**  
  When an anonymous notification or SMS is dispatched to a crush (*"Someone you know has a crush on you. You'll only find out who if you add them on Coy"*), allow the sender to optionally select a single non-identifying contextual tag. Examples:
  * *"Someone from your college/department"*
  * *"Someone who shares your love for Indie Music"*
  * *"Someone whose name starts with 'S'"*

* **Why this feature is required:**
  1. **Spam & Cold-SMS Resistance:** In modern communication, generic SMS notifications from unknown senders are frequently flagged as spam or phishing. Recipients often delete them without opening the app.
  2. **High Curiosity Conversion:** Subtle, safe context creates an irresistible curiosity loop. The recipient knows it's a real acquaintance rather than a bot, dramatically increasing app installs and add-backs.
  3. **Zero Privacy Compromise:** The sender's identity remains 100% confidential and hidden until a mutual match occurs, preserving Coy's core promise.

---

### Feature 2: Slot Recycling (Cooldown Timer) & Post-Match Icebreakers

* **What it is:**
  * **Slot Recycling (Cooldown):** When all 3 free crush slots are used, if an added crush does not join or respond within 14 days, allow the user to release/recycle that slot for free to add someone else.
  * **Post-Match Icebreakers:** The instant a mutual match is revealed (*"It's a match! You and [Crush] added each other"*), present a lightweight, playful icebreaker prompt (e.g., *"Reveal who added first?"*, *"Guess the crush song"*, or a direct one-tap conversation starter).

* **Why this feature is required:**
  1. **Churn Prevention & Retention:** Once a user fills all 3 slots and faces radio silence, they hit a dead-end experience. If they aren't ready to pay ₹49–₹199, they simply abandon or uninstall the app. Slot recycling brings inactive users back into the active weekly loop.
  2. **Bridging the Match-to-Conversation Gap:** Reaching out after a secret crush match can feel awkward or intimidating. In-app icebreakers remove the social friction and turn passive matches into real conversations.

---

### 🌈 Additional Product Consideration: Inclusive Orientation & Identity
* College and young-adult dating experiences require safety, comfort, and inclusivity.
* In production, the discovery feed should empower users to express their pronouns (`she/her`, `he/him`, `they/them`) and sexual orientation (`Straight`, `Lesbian`, `Gay`, `Bisexual`, `Queer`, `Pansexual`, `Asexual`), providing orientation-safe feed matching so everyone discovers compatible peers comfortably.

---

## 🛠️ Part B: "Discover" Tab Implementation

### Tech Stack
* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React Icons.
* **Animations & Gestures:** Framer Motion (touch drag gestures, rotational physics, swipe exit animations) & Canvas Confetti.
* **Backend:** Next.js Route Handlers (`/api/feed`, `/api/swipe`, `/api/matches`, `/api/reset`).
* **Storage:** JSON-backed persistent store (`data/state.json`) ensuring swipes and matches survive server restarts and browser reloads.

---

### Key Requirements & Architectural Highlights

1. **30 Seed Mock Profiles (`data/mockProfiles.ts`):**
   * Realistic profiles with names, ages, high-res Unsplash portraits, witty bios, college/city tags, and interests.
   * Inclusive representation with gender identity, pronouns, and orientations.
   * **Pre-liked Profiles:** 5 profiles (Kabir, Meera, Rohan, Devansh, Neel) are secretly flagged with `hasLikedUser: true` on the backend so demo testers can experience instant mutual matches.

2. **Privacy Guarantee (Core Coy Promise):**
   * The `hasLikedUser` flag is strictly server-side.
   * The `GET /api/feed` endpoint sanitizes every profile before sending it to the client. Inspecting the browser's Network tab will never leak who liked the user.

3. **Double Opt-in Swipe Logic:**
   * One profile card displayed at a time.
   * Swipe **Right** = Like | Swipe **Left** = Pass (Touch drag gestures on mobile + Pass/Like buttons on desktop).
   * Once swiped, a profile never appears in the feed again.
   * Clean empty state when all profiles are swiped.

4. **Celebration & Mutual Matches:**
   * Instant *"It's a match!"* modal with confetti when a pre-liked profile is liked.
   * Dedicated **Matches** view listing all mutual connections.

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sanskritig007/getcoy.git
cd Coy
npm install
```

### 2. Run Automated Backend & Privacy Test Suite
```bash
npm run test:backend
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
