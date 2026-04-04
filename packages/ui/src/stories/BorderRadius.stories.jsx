const radiusTokens = [
  { name: "0", value: "0px", cssVar: "--radius-0", figma: "radius-0" },
  { name: "0-5", value: "2px", cssVar: "--radius-0-5", figma: "radius-0,5" },
  { name: "1", value: "4px", cssVar: "--radius-1", figma: "radius-1" },
  { name: "1-5", value: "6px", cssVar: "--radius-1-5", figma: "radius-1,5" },
  { name: "2", value: "8px", cssVar: "--radius-2", figma: "radius-2" },
  { name: "3", value: "12px", cssVar: "--radius-3", figma: "radius-3" },
  { name: "4", value: "16px", cssVar: "--radius-4", figma: "radius-4" },
  { name: "5", value: "20px", cssVar: "--radius-5", figma: "radius-5" },
  { name: "6", value: "24px", cssVar: "--radius-6", figma: "radius-6" },
  { name: "8", value: "32px", cssVar: "--radius-8", figma: "radius-8" },
  { name: "10", value: "40px", cssVar: "--radius-10", figma: "radius-10" },
  { name: "12", value: "48px", cssVar: "--radius-12", figma: "radius-12" },
  { name: "full", value: "1000px", cssVar: "--radius-full", figma: "full" },
];

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "80px 80px 120px 100px 1fr",
  alignItems: "center",
  gap: 16,
  padding: "14px 0",
  borderBottom: "1px solid var(--color-neutral-200)",
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 500,
  color: "#1B1E1E",
  fontFamily: "monospace",
};

const metaStyle = {
  fontSize: 12,
  color: "#8F8F8F",
  fontFamily: "monospace",
};

const RadiusRow = ({ name, value, cssVar, figma }) => {
  const px = parseInt(value);
  const boxSize = Math.max(64, px * 2 + 16);

  return (
    <div style={rowStyle}>
      <div style={labelStyle}>{name}</div>
      <div style={metaStyle}>{value}</div>
      <div style={{ fontSize: 11, color: "#5F6161", fontFamily: "monospace" }}>rounded-{name}</div>
      <div style={{ fontSize: 11, color: "#5F6161", fontFamily: "monospace" }}>{figma}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: boxSize,
            height: 48,
            borderRadius: `var(${cssVar})`,
            backgroundColor: "var(--color-lime-400)",
            border: "1px solid var(--color-lime-500)",
          }}
        />
      </div>
    </div>
  );
};

const BorderRadiusShowcase = () => (
  <div style={{ padding: 24, maxWidth: 1000 }}>
    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#1B1E1E" }}>
      Border Radius
    </h1>
    <p style={{ fontSize: 14, color: "#5F6161", marginBottom: 8 }}>
      Custom radius tokens defined in <code style={{ fontSize: 12, background: "#F3F4F4", padding: "2px 6px", borderRadius: 4 }}>@theme</code>.
      Numeric scale matches the Figma spec 1:1.
    </p>
    <p style={{ fontSize: 13, color: "#8F8F8F", marginBottom: 32 }}>
      Usage: <code style={{ fontSize: 12, background: "#F3F4F4", padding: "2px 6px", borderRadius: 4 }}>rounded-3</code> = 12px,{" "}
      <code style={{ fontSize: 12, background: "#F3F4F4", padding: "2px 6px", borderRadius: 4 }}>rounded-full</code> = pill shape
    </p>

    <div style={rowStyle}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Scale</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Value</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Utility</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Figma</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preview</div>
    </div>

    {radiusTokens.map((t) => (
      <RadiusRow key={t.name} {...t} />
    ))}
  </div>
);

export default {
  title: "Foundations/Border Radius",
  component: BorderRadiusShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "neutral-white" },
  },
};

export const AllRadii = {
  render: () => <BorderRadiusShowcase />,
};
