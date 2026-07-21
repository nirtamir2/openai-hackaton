import { TrendType } from "../generated/enums";

export function getMockTrendData() {
  return [
    {
      source: "TikTok",
      type: TrendType.VIDEO,
      description: "Explaining B2B concepts using analogies",
      popularExamples: [
        "Stripe made a short-form vertical video explaining API integration like ordering pizza",
        "Vercel posted a TikTok comparing B2B SaaS architecture to running a restaurant",
      ],
    },
    {
      source: "LinkedIn",
      type: TrendType.TEXT,
      description: "Unconventional founder lessons",
      popularExamples: [
        "A startup CEO posted a viral text-only story about why they fired their top salesperson",
        "A founder wrote a post detailing the hard truth about their Series A pivot",
      ],
    },
    {
      source: "Twitter",
      type: TrendType.MEME,
      description: "Two Buttons Meme",
      popularExamples: [
        "Linear tweeted a two buttons meme comparing 'Ship broken feature' vs 'Delay launch'",
        "Supabase used the two buttons meme to highlight the pain points of choosing between SQL and NoSQL",
      ],
    },
    {
      source: "Industry Blogs",
      type: TrendType.NEWS,
      description: "The 'death' of Outbound Sales",
      popularExamples: [
        "HubSpot published a deep dive article about why traditional outbound sales is dead in 2026",
        "A popular marketing blog released a report on the end of traditional SEO as we know it",
      ],
    },
    {
      source: "Conferences",
      type: TrendType.EVENTS,
      description: "Niche Un-conferences",
      popularExamples: [
        "A prominent VC firm hosted a highly targeted invite-only founder dinner series",
        "A product management community organized a successful 'un-conference' focused on AI tooling",
      ],
    },
    {
      source: "Global News",
      type: TrendType.NEWS,
      description: "FIFA World Cup",
      popularExamples: [
        "Coca-Cola launched a global ad campaign tying their brand to the excitement of the World Cup finals",
        "Nike released a short film featuring top athletes preparing for the tournament",
      ],
    },
    {
      source: "Cultural Calendar",
      type: TrendType.EVENTS,
      description: "Mother's Day",
      popularExamples: [
        "Apple ran a 'Shot on iPhone' campaign highlighting photos and videos of mothers and their children",
        "A major e-commerce brand made a new advertisement relating to Mother's Day by showcasing small businesses owned by moms",
      ],
    },
    {
      source: "Cultural Calendar",
      type: TrendType.EVENTS,
      description: "Pride Month",
      popularExamples: [
        "Target launched a special Pride Month collection and highlighted stories from LGBTQ+ creators",
        "Spotify created a dedicated Pride hub featuring playlists curated by prominent LGBTQ+ artists",
      ],
    },
  ] as const;
}

export const mockTrendData = getMockTrendData();
