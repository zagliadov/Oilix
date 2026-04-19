/** Section ids on the home page — use with NavHashLink (`/#id` from other routes). */
export const navLinks = [
  { kind: "hash" as const, hash: "audience", navKey: "audience" },
  { kind: "hash" as const, hash: "promo", navKey: "promo" },
  { kind: "route" as const, href: "/catalog", navKey: "catalog" },
  { kind: "hash" as const, hash: "quality", navKey: "quality" },
  { kind: "hash" as const, hash: "contact", navKey: "order" },
] as const;

export type NavLinkNavKey = (typeof navLinks)[number]["navKey"];
