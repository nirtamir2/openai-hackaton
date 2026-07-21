export const signalColors = {
  background: "#f7f5f1",
  ink: "#17140f",
  accent: "#ff5a1f",
  success: "#2f6f4e",
  info: "#2f5fd6",
  idea: "#6a3fd1",
  reddit: "#c9440e",
  border: "rgba(23,20,15,0.1)",
  muted: "rgba(23,20,15,0.5)",
  mutedLight: "rgba(23,20,15,0.4)",
} as const;

export type SignalAccent = "accent" | "success" | "info" | "idea" | "reddit";

export function getSignalAccentColor({ accent }: { accent: SignalAccent }) {
  return signalColors[accent];
}
