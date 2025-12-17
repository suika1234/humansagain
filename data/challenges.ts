// src/data/challenges.ts

export type ChallengeCategory = "warm" | "confidence" | "charisma" | "connection";

export type Challenge = {
  id: number;
  text: string;
  category: ChallengeCategory;
  difficulty: 1 | 2 | 3;
};

export const CHALLENGES: Challenge[] = [
  // Warm & gentle
  {
    id: 1,
    text: "Ask someone how they really are — and give them time to answer.",
    category: "warm",
    difficulty: 1,
  },
  {
    id: 2,
    text: "Send a message to a friend you haven’t talked to in a while: “You crossed my mind today.”",
    category: "connection",
    difficulty: 1,
  },
  {
    id: 3,
    text: "Give a genuine compliment to someone’s personality or energy.",
    category: "warm",
    difficulty: 1,
  },

  // Confidence
  {
    id: 4,
    text: "Ask a coworker or classmate what they’re looking forward to this week.",
    category: "confidence",
    difficulty: 1,
  },
    {
    id: 5,
    text: "Share one small personal update with someone instead of saying “nothing much.”",
    category: "confidence",
    difficulty: 1,
  },

  // Charisma
  {
    id: 6,
    text: "Use someone’s name naturally in conversation at least once.",
    category: "charisma",
    difficulty: 1,
  },
  {
    id: 7,
    text: "Ask one follow-up question today instead of switching topics.",
    category: "charisma",
    difficulty: 1,
  },

  // Connection-deepening
  {
    id: 8,
    text: "Ask someone: “What’s something good that happened this week?”",
    category: "connection",
    difficulty: 1,
  },
  {
    id: 9,
    text: "Tell a close friend or family member one thing you appreciate about them.",
    category: "connection",
    difficulty: 2,
  },
  {
    id: 10,
    text: "Send a voice note instead of a text to someone you care about.",
    category: "connection",
    difficulty: 2,
  },

  // New prompts to keep things fresh
  {
    id: 11,
    text: "Share one thing that made you smile today with someone nearby.",
    category: "warm",
    difficulty: 1,
  },
  {
    id: 12,
    text: "Ask a friend: “What’s something you’re excited about this month?”",
    category: "connection",
    difficulty: 1,
  },
  {
    id: 13,
    text: "Offer a specific, genuine compliment about someone’s effort or kindness.",
    category: "warm",
    difficulty: 1,
  },
  {
    id: 14,
    text: "Send a short “thinking of you” voice note to someone you appreciate.",
    category: "connection",
    difficulty: 1,
  },
  {
    id: 15,
    text: "Invite someone to share a small win from their week—and celebrate it.",
    category: "connection",
    difficulty: 1,
  },
  {
    id: 16,
    text: "Practice a confident hello: smile, eye contact, and their name.",
    category: "confidence",
    difficulty: 1,
  },
  {
    id: 17,
    text: "Ask a curious follow-up like “Tell me more about that.” and really listen.",
    category: "charisma",
    difficulty: 1,
  },
  {
    id: 18,
    text: "Share one encouraging thought with someone who seems a bit stressed.",
    category: "warm",
    difficulty: 2,
  },
  {
    id: 19,
    text: "Invite a quick walk-and-talk or coffee with someone you’d like to know better.",
    category: "confidence",
    difficulty: 2,
  },
  {
    id: 20,
    text: "Ask: “What’s something you’re proud of lately?” and celebrate their answer.",
    category: "connection",
    difficulty: 2,
  },
  {
    id: 21,
    text: "Tell someone exactly why you appreciate having them in your life.",
    category: "connection",
    difficulty: 2,
  },
  {
    id: 22,
    text: "Share a small, positive personal story to invite deeper conversation.",
    category: "charisma",
    difficulty: 2,
  },
  {
    id: 23,
    text: "Offer to help with one tiny task for a friend or colleague today.",
    category: "warm",
    difficulty: 2,
  },
  {
    id: 24,
    text: "Reach out to someone you admire and tell them what you’ve learned from them.",
    category: "confidence",
    difficulty: 2,
  },
  {
    id: 25,
    text: "Ask: “What’s something you’re looking forward to?” and match their enthusiasm.",
    category: "connection",
    difficulty: 1,
  },

  // You can keep adding more here — we’ll later expand to 100+
];
