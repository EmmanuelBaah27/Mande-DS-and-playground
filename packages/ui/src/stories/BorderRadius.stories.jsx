const radiusTokens = [
  { name: "0",    value: "0px",    cssVar: "--radius-0",    figma: "radius-0" },
  { name: "0-5",  value: "2px",    cssVar: "--radius-0-5",  figma: "radius-0,5" },
  { name: "1",    value: "4px",    cssVar: "--radius-1",    figma: "radius-1" },
  { name: "1-5",  value: "6px",    cssVar: "--radius-1-5",  figma: "radius-1,5" },
  { name: "2",    value: "8px",    cssVar: "--radius-2",    figma: "radius-2" },
  { name: "3",    value: "12px",   cssVar: "--radius-3",    figma: "radius-3" },
  { name: "4",    value: "16px",   cssVar: "--radius-4",    figma: "radius-4" },
  { name: "5",    value: "20px",   cssVar: "--radius-5",    figma: "radius-5" },
  { name: "6",    value: "24px",   cssVar: "--radius-6",    figma: "radius-6" },
  { name: "8",    value: "32px",   cssVar: "--radius-8",    figma: "radius-8" },
  { name: "10",   value: "40px",   cssVar: "--radius-10",   figma: "radius-10" },
  { name: "12",   value: "48px",   cssVar: "--radius-12",   figma: "radius-12" },
  { name: "full", value: "1000px", cssVar: "--radius-full", figma: "full" },
];

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "64px 56px 120px 100px 1fr",
  alignItems: "center",
  gap: 16,
  padding: "14px 0",
  borderBottom: "1px solid #EBEBEB",
};

const RadiusRow = ({ name, value, cssVar, figma }) => (
  <div style={rowStyle}>
    <div style={{ fontSize: 13, fontWeight: 500, color: "#1B1E1E", fontFamily: "monospace" }}>{name}</div>
    <div style={{ fontSize: 12, color: "#8F8F8F", fontFamily: "monospace" }}>{value}</div>
    <div style={{ fontSize: 11, color: "#5F6161", fontFamily: "monospace" }}>rounded-{name}</div>
    <div style={{ fontSize: 11, color: "#5F6161", fontFamily: "monospace" }}>{figma}</div>
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* White box with border — corner shape is clearly visible */}
      <div
        style={{
          width: 80,
          height: 48,
          borderRadius: `var(${cssVar})`,
          backgroundColor: "#ffffff",
          border: "2px solid #1B1E1E",
        }}
      />
    </div>
  </div>
);

const BorderRadiusShowcase = () => (
  <div style={{ padding: 24, maxWidth: 960, backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
    <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#1B1E1E" }}>
      Border Radius
    </h1>
    <p style={{ fontSize: 13, color: "#5F6161", marginBottom: 32 }}>
      Numeric scale maps 1:1 to Figma.{" "}
      <code style={{ fontSize: 12, background: "#E8E8E8", padding: "2px 6px", borderRadius: 4 }}>rounded-3</code> = 12px ·{" "}
      <code style={{ fontSize: 12, background: "#E8E8E8", padding: "2px 6px", borderRadius: 4 }}>rounded-full</code> = pill
    </p>

    <div style={{ backgroundColor: "#ffffff", borderRadius: 12, padding: "0 24px", border: "1px solid #EBEBEB" }}>
      <div style={{ ...rowStyle, borderBottom: "1px solid #EBEBEB" }}>
        {["Scale", "Value", "Utility", "Figma", "Preview"].map((h) => (
          <div key={h} style={{ fontSize: 11, fontWeight: 600, color: "#8F8F8F", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
        ))}
      </div>
      {radiusTokens.map((t) => (
        <RadiusRow key={t.name} {...t} />
      ))}
    </div>
  </div>
);

export default {
  title: "Foundations/Border Radius",
  component: BorderRadiusShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
  },
};

export const AllRadii = {
  render: () => <BorderRadiusShowcase />,
};
