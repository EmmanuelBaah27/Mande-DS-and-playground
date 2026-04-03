const spacingTokens = [
  { name: "0", value: "0px", utility: "p-0" },
  { name: "0.5", value: "2px", utility: "p-0.5" },
  { name: "1", value: "4px", utility: "p-1" },
  { name: "1.5", value: "6px", utility: "p-1.5" },
  { name: "2", value: "8px", utility: "p-2" },
  { name: "2.5", value: "10px", utility: "p-2.5" },
  { name: "3", value: "12px", utility: "p-3" },
  { name: "4", value: "16px", utility: "p-4" },
  { name: "5", value: "20px", utility: "p-5" },
  { name: "6", value: "24px", utility: "p-6" },
  { name: "7", value: "28px", utility: "p-7" },
  { name: "8", value: "32px", utility: "p-8" },
  { name: "9", value: "36px", utility: "p-9" },
  { name: "10", value: "40px", utility: "p-10" },
  { name: "12", value: "48px", utility: "p-12" },
  { name: "14", value: "56px", utility: "p-14" },
  { name: "16", value: "64px", utility: "p-16" },
  { name: "18", value: "72px", utility: "p-18" },
  { name: "20", value: "80px", utility: "p-20" },
];

const figmaMap = {
  "0": "sp-0",
  "0.5": "sp-0,5",
  "1": "sp-1",
  "1.5": "sp-1,5",
  "2": "sp-2",
  "2.5": "sp-2,5",
  "3": "sp-3",
  "4": "sp-4",
  "5": "sp-5",
  "6": "sp-6",
  "7": "sp-7",
  "8": "sp-8",
  "9": "sp-9",
  "10": "sp-10",
  "12": "sp-12",
  "14": "sp-14",
  "16": "sp-16",
  "18": "sp-18",
  "20": "sp-20",
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "80px 80px 100px 1fr",
  alignItems: "center",
  gap: 16,
  padding: "10px 0",
  borderBottom: "1px solid var(--color-grey-200)",
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

const SpacingRow = ({ name, value, utility }) => (
  <div style={rowStyle}>
    <div style={labelStyle}>{name}</div>
    <div style={metaStyle}>{value}</div>
    <div style={{ fontSize: 11, color: "#5F6161", fontFamily: "monospace" }}>{figmaMap[name]}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: parseInt(value),
          height: 24,
          backgroundColor: "var(--color-lime-400)",
          borderRadius: 4,
          minWidth: 2,
        }}
      />
    </div>
  </div>
);

const SpacingShowcase = () => (
  <div style={{ padding: 24, maxWidth: 900 }}>
    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#1B1E1E" }}>
      Spacing
    </h1>
    <p style={{ fontSize: 14, color: "#5F6161", marginBottom: 8 }}>
      Uses Tailwind v4's default 4px multiplier. Numeric scale matches the Figma spec 1:1.
    </p>
    <p style={{ fontSize: 13, color: "#8F8F8F", marginBottom: 32 }}>
      Usage: <code style={{ fontSize: 12, background: "#F3F4F4", padding: "2px 6px", borderRadius: 4 }}>p-5</code> = 20px,{" "}
      <code style={{ fontSize: 12, background: "#F3F4F4", padding: "2px 6px", borderRadius: 4 }}>gap-3</code> = 12px,{" "}
      <code style={{ fontSize: 12, background: "#F3F4F4", padding: "2px 6px", borderRadius: 4 }}>m-0.5</code> = 2px
    </p>

    <div style={rowStyle}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Scale</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Value</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Figma</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5F6161", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preview</div>
    </div>

    {spacingTokens.map((t) => (
      <SpacingRow key={t.name} {...t} />
    ))}
  </div>
);

export default {
  title: "Foundations/Spacing",
  component: SpacingShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "neutral-white" },
  },
};

export const AllSpacing = {
  render: () => <SpacingShowcase />,
};
