import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oilix",
    short_name: "Oilix",
    description: "Motor oils and auto fluids with delivery.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f4f5",
    theme_color: "#475569",
  };
}
