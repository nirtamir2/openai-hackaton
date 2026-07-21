export type GrowthAgentDayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type GrowthAgentFeedItemType =
  | "reddit"
  | "post"
  | "ad"
  | "newsjack";

export interface GrowthAgentFeedItem {
  id: string;
  day: GrowthAgentDayKey;
  type: GrowthAgentFeedItemType;
  tag: string;
  color: string;
  colorBg: string;
  title: string;
  meta: string;
  live?: boolean;
  defaultCompleted?: boolean;
  why?: string;
  quote?: string;
  reply?: string;
  threadUrl?: string;
  draftBody?: string;
  draftBodyX?: string;
  draftBodyLinkedIn?: string;
  headline?: string;
  body?: string;
  format?: string;
  platform?: string;
  budget?: string;
  creativeLabel?: string;
  isVideo?: boolean;
}

export interface GrowthAgentProject {
  id: string;
  type?: "ad";
  tag: string;
  color: string;
  colorBg: string;
  title: string;
  meta: string;
  defaultCompleted?: boolean;
  doneLabel?: string;
  isVideo?: boolean;
  description?: string;
  why?: string;
  headline?: string;
  body?: string;
  format?: string;
  platform?: string;
  budget?: string;
  creativeLabel?: string;
  todos: Array<{
    id: string;
    text: string;
    done: boolean;
    hireUrl?: string;
  }>;
}

export interface GrowthAgentIdea {
  id: string;
  title: string;
  meta: string;
  description: string;
  why?: string;
  references?: Array<{ label: string; url: string }>;
  materials?: Array<{ label: string }>;
  todos: Array<{ id: string; text: string; done: boolean }>;
}

export interface GrowthAgentDay {
  key: GrowthAgentDayKey;
  label: string;
  date: number;
}

export const growthAgentToday: GrowthAgentDayKey = "tue";

export const growthAgentDays: Array<GrowthAgentDay> = [
  { key: "mon", label: "MON", date: 20 },
  { key: "tue", label: "TUE", date: 21 },
  { key: "wed", label: "WED", date: 22 },
  { key: "thu", label: "THU", date: 23 },
  { key: "fri", label: "FRI", date: 24 },
  { key: "sat", label: "SAT", date: 25 },
  { key: "sun", label: "SUN", date: 26 },
];

export const growthAgentFeedItems: Array<GrowthAgentFeedItem> = [
  {
    id: "mon1",
    day: "mon",
    type: "reddit",
    tag: "REDDIT REPLY",
    color: "#c9440e",
    colorBg: "rgba(255,90,31,0.1)",
    title: "Replied to u/sara_langs on r/Spanish",
    meta: "posted 5 days ago",
    defaultCompleted: true,
    why: "Someone asked for a Babbel alternative that's better for actual conversation — a great spot to mention what makes Langotalk different, without sounding like an ad.",
    quote: 'u/sara_langs: "Is there anything better than Babbel for actually holding a conversation?"',
    reply:
      '"Babbel is great for structure but light on live conversation. Langotalk\'s AI tutor is built specifically for spoken practice, worth trying alongside it."',
    threadUrl: "https://reddit.com/r/Spanish/comments/sara_langs_thread",
  },
  {
    id: "tue1",
    day: "tue",
    type: "reddit",
    tag: "REDDIT REPLY",
    color: "#c9440e",
    colorBg: "rgba(255,90,31,0.1)",
    title: "Reply to u/mikeb92 — Mexico trip in 3 weeks",
    meta: "2h ago · 47 upvotes",
    live: true,
    why: "This person is actively asking for a conversation-practice routine before a trip — exactly the problem Langotalk solves, and they're likely to try something today, not just window-shop.",
    quote:
      'u/mikeb92: "Duolingo feels like a game, I need actual conversation practice before my trip to Mexico in 3 weeks."',
    reply:
      '"3 weeks is enough if you front-load speaking, not vocab. I\'d do 15 min/day of actual conversation practice (Langotalk\'s AI tutor does this if you don\'t have a person to practice with) plus review the 100 most common travel phrases the night before. Vocab apps alone won\'t get your mouth ready to actually talk."',
    threadUrl: "https://reddit.com/r/languagelearning/comments/mikeb92_thread",
  },
  {
    id: "tue3",
    day: "tue",
    type: "post",
    tag: "X POST",
    color: "#17140f",
    colorBg: "rgba(23,20,15,0.08)",
    title: "Quick tip: front-load speaking before a trip",
    meta: "drafted from this week's Reddit signal",
    why: "Several people this week asked about cramming speaking practice before a trip — turning that into a standalone tip post reaches people browsing X, not just the one Reddit thread.",
    draftBody:
      "Traveling in under a month and panicking about the language? Skip more vocab drills.\n\nDo this instead: 15 min/day of actual spoken conversation, plus the 100 most common travel phrases the night before you land. Your mouth needs the reps, not your flashcard streak.",
  },
  {
    id: "tue4",
    day: "tue",
    type: "post",
    tag: "LINKEDIN POST",
    color: "#0a66c2",
    colorBg: "rgba(10,102,194,0.1)",
    title: "LinkedIn post: what App Store reviews taught us",
    meta: "drafted from competitor review analysis",
    why: "The LinkedIn audience skews toward other founders and operators — sharing what you learned from mining competitor reviews reads as credible thought-leadership, not an ad.",
    draftBody:
      'We read 40 recent 1–3 star reviews of the big language apps this week. The same complaint showed up in 61% of them: "feels like a game, not real conversation."\n\nThat\'s not a UX nitpick — it\'s the whole product. Streaks and mini-games optimize for opening the app, not for the skill people actually came for.\n\nBuilding Langotalk around that gap has been the single clearest signal we\'ve had in months.',
  },
  {
    id: "wed1",
    day: "wed",
    type: "reddit",
    tag: "REDDIT REPLY",
    color: "#c9440e",
    colorBg: "rgba(255,90,31,0.1)",
    title: "Reply to u/kseries9 — wants spoken practice",
    meta: "40m ago · 12 upvotes",
    why: "They're frustrated with tap-to-answer apps and are explicitly looking for something that makes them speak out loud — a warm, ready-to-convert audience for Langotalk.",
    quote: 'u/kseries9: "any AI apps that actually make you speak out loud, not just tap answers?"',
    reply:
      '"If tapping answers is the problem, you want something that forces you to actually talk — Langotalk\'s tutor holds a real spoken conversation instead of multiple choice. Worth trying for a week."',
    threadUrl: "https://reddit.com/r/duolingo/comments/kseries9_thread",
  },
  {
    id: "wed2",
    day: "wed",
    type: "post",
    tag: "REDDIT POST",
    color: "#c9440e",
    colorBg: "rgba(255,90,31,0.1)",
    title: "Founder story: why I built Langotalk",
    meta: "drafted for r/SaaS",
    why: "Founder stories that admit a real flaw consistently outperform typical launch posts, and r/SaaS rewards authentic build-in-public content over pitches.",
    draftBody:
      "Two years ago I was on day 400 of a Duolingo streak and still couldn't hold a real conversation in Spanish. Turns out matching cartoon owls to word tiles isn't the same as talking to a human.\n\nThat gap is the whole reason I started building Langotalk — an AI tutor that just talks to you, out loud, like a person would. No streaks, no gems, just practice.\n\nHappy to answer questions about building it if anyone's curious.",
  },
  {
    id: "thu1",
    day: "thu",
    type: "ad",
    tag: "PAID AD",
    color: "#2f5fd6",
    colorBg: "rgba(47,95,214,0.1)",
    title: "Comparison ad: Langotalk vs Duolingo",
    meta: 'targets "alternatives" searches',
    why: 'People are actively searching for "Duolingo alternatives" — this ad meets them at the exact moment they\'re comparing options.',
    headline: "Duolingo teaches you to match. Langotalk teaches you to talk.",
    body: "Side-by-side: streaks and mini-games vs. daily spoken conversation with an AI tutor that corrects you in real time.",
    format: "Static image",
    creativeLabel: "Ad creative placeholder",
    platform: "Google Search Ads",
    budget: "$25/day suggested",
  },
  {
    id: "thu2",
    day: "thu",
    type: "post",
    tag: "X POST",
    color: "#17140f",
    colorBg: "rgba(23,20,15,0.08)",
    title: "Founder story thread for X",
    meta: "drafted as a 5-post thread",
    why: "A short, honest thread about why you built Langotalk tends to travel further on X than a feature announcement.",
    draftBody:
      "1/ 400-day Duolingo streak. Still couldn't order coffee in Spanish.\n\n2/ That's when it hit me: matching tiles isn't the same skill as talking to a human.\n\n3/ So I built Langotalk — an AI tutor that just talks to you out loud, like a real conversation.\n\n4/ No streaks. No gems. Just 15 minutes of actually speaking, every day.\n\n5/ If you've ever felt \"fluent\" in an app and frozen in real life, this is for you.",
  },
  {
    id: "fri1",
    day: "fri",
    type: "newsjack",
    tag: "X + LINKEDIN",
    color: "#0a66c2",
    colorBg: "rgba(10,102,194,0.1)",
    title: 'React to Duolingo\'s mascot "death" going viral',
    meta: 'Duo "died" again this week · 40M+ views on the stunt',
    why: "Duolingo's owl stunt is trending again — a quick, credible reaction from a competitor founder rides that attention.",
    draftBodyX:
      "Duolingo killed the owl again. Meanwhile the actual thing people can't do after 400 days? Hold a conversation.\n\nA mascot funeral is a great marketing stunt. It's not a study plan.",
    draftBodyLinkedIn:
      "Duolingo's owl \"died\" again this week — and it'll get the engagement it's designed for.\n\nBut it's worth asking what these stunts are covering for: gamification metrics optimize for opening the app, not for being able to speak the language.\n\nAt Langotalk we'd rather be boring and useful: no mascot, no streak funeral, just daily spoken practice with an AI tutor.",
  },
];

export const growthAgentIdeas: Array<GrowthAgentIdea> = [
  {
    id: "idea1",
    title: "Referral nudge for Korean 7-day streakers",
    meta: "from usage analytics · 12 users hit a 7-day streak",
    description:
      "12 users just hit a 7-day Korean streak. Streak-holders share apps 4x more than average — this is the highest-converting moment to ask. Turn it into an in-app popup + one-tap share message.",
    why: "12 people just hit a 7-day Korean streak — right when they're most excited about their progress, so it's the best moment to ask them to invite a friend.",
    references: [
      { label: "Streak cohort report — last 90 days", url: "#" },
      { label: "Day-7 share rate benchmark (internal)", url: "#" },
    ],
    materials: [
      { label: "Existing referral popup template" },
      { label: "Korean course icon set" },
      { label: "Brand voice guide" },
    ],
    todos: [
      { id: "t1", text: "Write the in-app popup copy", done: false },
      { id: "t2", text: "Design the one-tap share message", done: false },
      { id: "t3", text: "Ship to the 12 streak-holders", done: false },
      { id: "t4", text: "Track referral signups after 7 days", done: false },
    ],
  },
];

export const growthAgentProjects: Array<GrowthAgentProject> = [
  {
    id: "adproj1",
    type: "ad",
    tag: "PAID AD · VIDEO",
    color: "#2f5fd6",
    colorBg: "rgba(47,95,214,0.1)",
    title: 'Instagram video ad: "Tired of gamified apps?"',
    meta: "video · live · running continuously",
    defaultCompleted: true,
    doneLabel: "Live",
    isVideo: true,
    why: '61% of recent Duolingo/Babbel reviews complain it "feels like a game, not real conversation" — a short video showing a real spoken conversation proves it faster than a static image.',
    headline: "Tired of gamified language apps that don't make you talk?",
    body: "Duolingo owns the streak. Langotalk owns the conversation. Get 15 minutes of real spoken practice a day — no cartoon owls, no vocab drills, just talking.",
    format: "Video · 15s",
    creativeLabel: "Video ad placeholder",
    platform: "Instagram / Meta Ads",
    budget: "$15/day suggested",
    todos: [],
  },
  {
    id: "proj1",
    tag: "PROJECT",
    color: "#6a3fd1",
    colorBg: "rgba(106,63,209,0.1)",
    title: "Affiliate program with language-learning YouTubers",
    meta: "started 12 days ago",
    description:
      "Reaching out to mid-size language-learning YouTubers for affiliate placements. Tracking response rate and negotiating rates.",
    why: "Paid ads are getting more expensive per signup — creators who already have engaged language-learning audiences are a cheaper, more trusted channel.",
    todos: [
      { id: "t1", text: "Shortlist 10 mid-size language-learning YouTubers", done: true },
      { id: "t2", text: "Send outreach emails", done: true },
      { id: "t3", text: "Negotiate affiliate rates", done: false },
      { id: "t4", text: "Set up tracking links", done: false },
    ],
  },
  {
    id: "proj2",
    tag: "PROJECT",
    color: "#6a3fd1",
    colorBg: "rgba(106,63,209,0.1)",
    title: "Video testimonials for the landing page",
    meta: "blocking the new homepage launch",
    description:
      "Need 3–4 short customer testimonial clips cut from raw customer Zoom calls into 30-second cuts.",
    why: "Real customer voices convert better than stock copy, and the landing page currently has zero video social proof.",
    todos: [
      { id: "t1", text: "Collect raw customer Zoom clips", done: true },
      {
        id: "t2",
        text: "Hire a freelance video editor",
        done: false,
        hireUrl: "https://upwork.com/freelancers/video-editors",
      },
      { id: "t3", text: "Review final cuts", done: false },
    ],
  },
  {
    id: "proj3",
    tag: "PROJECT",
    color: "#6a3fd1",
    colorBg: "rgba(106,63,209,0.1)",
    title: 'SEO blog pipeline: "10 Duolingo alternatives"',
    meta: "targets 2,400 searches/mo",
    description: 'A comparison blog post targeting "Duolingo alternatives" search volume.',
    why: '"Duolingo alternatives" gets 2,400 searches a month and Langotalk doesn\'t rank for it yet — this is free, compounding traffic once it\'s live.',
    todos: [
      { id: "t1", text: "Draft blog post", done: true },
      { id: "t2", text: "Review draft", done: false },
      { id: "t3", text: "Publish to blog", done: false },
    ],
  },
];

export const growthAgentDailyRevenue = [
  180, 210, 195, 260, 240, 310, 290, 330, 355, 300, 410, 380, 390, 460,
];

export const growthAgentRevenueSources = [
  {
    name: "Reddit (agent replies)",
    utm: "utm_source=reddit&utm_medium=organic",
    revenue: 2980,
    spend: 0,
    customers: 35,
    color: "#c9440e",
    note: "organic · agent-sourced",
  },
  {
    name: "Meta Ads",
    utm: "utm_source=meta&utm_campaign=tired_of_gamified",
    revenue: 2340,
    spend: 620,
    customers: 28,
    color: "#2f5fd6",
    note: "3.8x ROAS",
  },
  {
    name: "Google Search Ads",
    utm: "utm_source=google&utm_campaign=duolingo_alternatives",
    revenue: 1860,
    spend: 530,
    customers: 21,
    color: "#6a3fd1",
    note: "3.5x ROAS",
  },
  {
    name: "Direct / unattributed",
    utm: "no UTM captured",
    revenue: 1240,
    spend: 0,
    customers: 12,
    color: "rgba(23,20,15,0.35)",
    note: "unknown source",
  },
];

export const growthAgentDayNames: Record<GrowthAgentDayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export function getCompanyNameFromUrl({ url }: { url: string }) {
  if (url.length === 0) {
    return "Your product";
  }

  const normalized = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] ?? url;
  const namePart = normalized.split(".")[0] ?? normalized;

  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
}
