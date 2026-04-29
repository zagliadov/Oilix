import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Oilix";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background:
            "linear-gradient(135deg, rgb(244, 244, 245) 0%, rgb(228, 228, 232) 100%)",
          color: "rgb(24, 24, 27)",
          padding: "88px",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgb(82, 82, 91)",
          }}
        >
          Oilix
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 68,
            lineHeight: 1.08,
            fontWeight: 700,
            maxWidth: "90%",
          }}
        >
          Motor oils and auto fluids with delivery
        </div>
      </div>
    ),
    size,
  );
}
