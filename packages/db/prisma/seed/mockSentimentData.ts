import { SentimentLabel, SentimentSource } from "../generated/enums";

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

export function getMockSentimentData() {
  return [
    {
      content:
        "Setup took less than an hour and the funnel visualization immediately helped our team spot drop-off in onboarding.",
      sentimentLabel: SentimentLabel.POSITIVE,
      sentimentScore: 0.86,
      confidence: 0.92,
      source: SentimentSource.REVIEW,
      sourceUrl: "https://reviews.example.com/nimbus/4821",
      customerName: "Maya Chen",
      analyzedAt: hoursAgo(30),
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
      analyzedAt: hoursAgo(22),
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
      analyzedAt: hoursAgo(16),
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
      analyzedAt: hoursAgo(12),
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
      analyzedAt: hoursAgo(8),
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
      analyzedAt: hoursAgo(5),
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
      analyzedAt: hoursAgo(3),
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
      analyzedAt: hoursAgo(1),
    },
  ] as const;
}
