import {
  MarketingTaskType,
  SentimentLabel,
  SentimentSource,
} from "../generated/enums";

export const MOCK_PRODUCT_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";

export const mockProductData = {
  id: MOCK_PRODUCT_ID,
  generalDescription:
    "Nimbus Analytics is a B2B product analytics platform that helps growth teams track user journeys, build conversion funnels, and surface retention insights without writing SQL.",
  plusSides:
    "Fast onboarding, intuitive funnel builder, strong cohort analysis, and a generous free tier for early-stage startups.",
  minusSides:
    "Limited mobile SDK coverage, advanced segmentation is locked behind higher tiers, and export options are basic on lower plans.",
  mainCompetitors: "Mixpanel, Amplitude, Heap, PostHog",
  marketingTasks: [
    {
      description: "Publish a comparison landing page against Mixpanel and Amplitude",
      taskType: MarketingTaskType.SHORT,
      priority: 1,
      targetDate: new Date("2026-08-15T09:00:00.000Z"),
    },
    {
      description: "Launch a 3-part email nurture sequence for trial users who have not created a funnel",
      taskType: MarketingTaskType.SHORT,
      priority: 2,
      targetDate: new Date("2026-08-22T09:00:00.000Z"),
    },
    {
      description: "Run LinkedIn ads targeting product managers at Series A SaaS companies",
      taskType: MarketingTaskType.SHORT,
      priority: 3,
      targetDate: new Date("2026-09-01T09:00:00.000Z"),
    },
    {
      description: "Ship a public product roadmap and customer advisory board program",
      taskType: MarketingTaskType.LONG,
      priority: 2,
      targetDate: new Date("2026-11-30T09:00:00.000Z"),
    },
    {
      description: "Build an integration marketplace with Stripe, HubSpot, and Segment",
      taskType: MarketingTaskType.LONG,
      priority: 1,
      targetDate: new Date("2027-01-31T09:00:00.000Z"),
    },
  ],
  sentiments: [
    {
      content:
        "Setup took less than an hour and the funnel visualization immediately helped our team spot drop-off in onboarding.",
      sentimentLabel: SentimentLabel.POSITIVE,
      sentimentScore: 0.86,
      confidence: 0.92,
      source: SentimentSource.REVIEW,
      sourceUrl: "https://reviews.example.com/nimbus/4821",
      customerName: "Maya Chen",
      analyzedAt: new Date("2026-07-10T14:22:00.000Z"),
    },
    {
      content:
        "The dashboard is useful, but exporting raw event data for custom analysis is painful on our current plan.",
      sentimentLabel: SentimentLabel.NEGATIVE,
      sentimentScore: -0.61,
      confidence: 0.88,
      source: SentimentSource.REVIEW,
      sourceUrl: "https://reviews.example.com/nimbus/4903",
      customerName: "Jonah Patel",
      analyzedAt: new Date("2026-07-12T11:05:00.000Z"),
    },
    {
      content:
        "Support resolved our tracking issue quickly. Would like clearer docs around server-side event naming conventions.",
      sentimentLabel: SentimentLabel.MIXED,
      sentimentScore: 0.18,
      confidence: 0.79,
      source: SentimentSource.SUPPORT,
      sourceUrl: null,
      customerName: "Elena Ruiz",
      analyzedAt: new Date("2026-07-14T16:40:00.000Z"),
    },
    {
      content:
        "NPS survey response: 9/10. Team loves cohort retention charts, but mobile analytics still feels behind competitors.",
      sentimentLabel: SentimentLabel.MIXED,
      sentimentScore: 0.34,
      confidence: 0.84,
      source: SentimentSource.SURVEY,
      sourceUrl: null,
      customerName: "Northwind Labs",
      analyzedAt: new Date("2026-07-16T08:15:00.000Z"),
    },
    {
      content:
        "Pricing is fair for startups, though advanced segmentation should not require an enterprise conversation.",
      sentimentLabel: SentimentLabel.NEGATIVE,
      sentimentScore: -0.42,
      confidence: 0.81,
      source: SentimentSource.SOCIAL,
      sourceUrl: "https://social.example.com/post/88341",
      customerName: "alex_growth",
      analyzedAt: new Date("2026-07-18T19:30:00.000Z"),
    },
    {
      content:
        "In-app prompt feedback: funnel builder is intuitive and saved us from building internal reporting tooling.",
      sentimentLabel: SentimentLabel.POSITIVE,
      sentimentScore: 0.78,
      confidence: 0.9,
      source: SentimentSource.IN_APP,
      sourceUrl: null,
      customerName: null,
      analyzedAt: new Date("2026-07-19T10:12:00.000Z"),
    },
    {
      content:
        "We evaluated Heap and Amplitude. Nimbus won on time-to-value, but lost on depth of mobile event capture.",
      sentimentLabel: SentimentLabel.NEUTRAL,
      sentimentScore: 0.04,
      confidence: 0.76,
      source: SentimentSource.OTHER,
      sourceUrl: null,
      customerName: "Brightline Health",
      analyzedAt: new Date("2026-07-20T13:48:00.000Z"),
    },
    {
      content:
        "Weekly active users grew after we switched dashboards. The team finally agrees on one source of truth.",
      sentimentLabel: SentimentLabel.POSITIVE,
      sentimentScore: 0.91,
      confidence: 0.94,
      source: SentimentSource.REVIEW,
      sourceUrl: "https://reviews.example.com/nimbus/5012",
      customerName: "Samira Okonkwo",
      analyzedAt: new Date("2026-07-21T09:27:00.000Z"),
    },
  ],
} as const;
