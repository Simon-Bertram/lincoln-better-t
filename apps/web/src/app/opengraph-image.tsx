import { ImageResponse } from "next/og";

export const alt =
  "The Lincoln Institute Directory - Historical Student Records 1866-1922";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        backgroundImage: "linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxWidth: "900px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #1e40af 0%, #7c3aed 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "20px",
          }}
        >
          The Lincoln Institute Directory
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#64748b",
            marginBottom: "30px",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Historical Student Records 1866-1922
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#475569",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Explore Civil War orphan records and student directories from this
          Philadelphia charity
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "30px",
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#7c3aed",
              borderRadius: "50%",
              marginRight: "12px",
            }}
          />
          Founded by Mary McHenry Cox • Philadelphia, PA
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
