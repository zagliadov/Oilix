export const navLinks = [
  { href: "#audience", navKey: "audience" },
  { href: "#range", navKey: "catalog" },
  { href: "#quality", navKey: "quality" },
  { href: "#contact", navKey: "order" },
] as const;

export type NavLinkNavKey = (typeof navLinks)[number]["navKey"];
