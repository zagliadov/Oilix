/** Shared palette for HTML emails (light storefront — `app/globals.css` :root). */
export const emailTheme = {
  pageBg: "#ececf0",
  card: "#ffffff",
  text: "#18181b",
  muted: "#52525b",
  border: "#e4e4e7",
  accent: "#475569",
  accentSoft: "rgba(71, 85, 105, 0.1)",
  rowAlt: "#f4f4f5",
} as const;

export const emailFontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
export const emailDisplayStack =
  "Oswald, Impact, 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif";
