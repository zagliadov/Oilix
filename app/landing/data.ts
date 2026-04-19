/** Section id on the home page — use with NavHashLink (same route: `#id`, other routes: `/#id`). */
export const navLinks = [
  { hash: "audience", navKey: "audience" },
  { hash: "range", navKey: "catalog" },
  { hash: "quality", navKey: "quality" },
  { hash: "contact", navKey: "order" },
] as const;

export type NavLinkNavKey = (typeof navLinks)[number]["navKey"];
