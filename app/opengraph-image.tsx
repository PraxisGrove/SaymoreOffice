import { ImageResponse } from "next/og";

export const alt = "Saymore - Speak naturally. Type anywhere.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const bars = [
  { id: "one", height: 32 },
  { id: "two", height: 58 },
  { id: "three", height: 88 },
  { id: "four", height: 50 },
  { id: "five", height: 112 },
  { id: "six", height: 72 },
  { id: "seven", height: 42 },
  { id: "eight", height: 94 },
  { id: "nine", height: 64 },
  { id: "ten", height: 36 },
  { id: "eleven", height: 76 },
  { id: "twelve", height: 48 },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "56px",
        background: "#f5f6f3",
        color: "#111311",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          border: "2px solid #111311",
          background: "#ffffff",
          boxShadow: "14px 14px 0 #315ce6",
        }}
      >
        <div
          style={{
            width: "55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
            borderRight: "2px solid #111311",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: "58px",
                height: "58px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                borderRadius: "8px",
                background: "#111311",
              }}
            >
              {[18, 30, 22].map((height, index) => (
                <div
                  key={height}
                  style={{
                    width: "6px",
                    height: `${height}px`,
                    borderRadius: "3px",
                    background: index === 1 ? "#8cffa8" : "#ffffff",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", fontSize: "34px", fontWeight: 700 }}>Saymore</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "58px",
                lineHeight: 1.05,
                fontWeight: 750,
              }}
            >
              <span style={{ display: "flex" }}>Speak naturally.</span>
              <span style={{ display: "flex" }}>Type anywhere.</span>
            </div>
            <div style={{ display: "flex", fontSize: "24px", lineHeight: 1.4, color: "#575b57" }}>
              Local-first voice input for every app.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "18px" }}>
            <span style={{ display: "flex", padding: "8px 13px", border: "1px solid #a9ada9", borderRadius: "6px" }}>
              macOS
            </span>
            <span style={{ display: "flex", padding: "8px 13px", border: "1px solid #a9ada9", borderRadius: "6px" }}>
              Windows
            </span>
            <span style={{ display: "flex", color: "#575b57" }}>Local first</span>
          </div>
        </div>

        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "42px",
            background: "#111311",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "18px" }}>
            <span style={{ display: "flex", color: "#aeb3ae" }}>VOICE INPUT</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "6px",
                background: "#dff7e7",
                color: "#176b36",
              }}
            >
              <span
                style={{ display: "flex", width: "8px", height: "8px", borderRadius: "50%", background: "#26a553" }}
              />
              Ready
            </span>
          </div>

          <div
            style={{
              height: "230px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "11px",
              border: "1px solid #3f433f",
              borderRadius: "8px",
              background: "#1c1f1c",
            }}
          >
            {bars.map(({ id, height }, index) => (
              <div
                key={id}
                style={{
                  width: "13px",
                  height: `${height}px`,
                  borderRadius: "7px",
                  background: index > 3 && index < 9 ? "#5f82f4" : "#7b817b",
                }}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#111311",
              fontSize: "20px",
            }}
          >
            <span style={{ display: "flex", color: "#575b57" }}>Right Command</span>
            <strong style={{ display: "flex" }}>Hold to speak</strong>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
