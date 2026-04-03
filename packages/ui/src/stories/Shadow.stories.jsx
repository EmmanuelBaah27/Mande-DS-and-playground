const shadowTokens = [
  {
    name: "2xs",
    cssVar: "--shadow-2xs",
    value: "0 1px 0 0 rgba(0, 0, 0, 0.05)",
    description: "Subtle border-like shadow",
  },
  {
    name: "xs",
    cssVar: "--shadow-xs",
    value: "0 1px 2px 0 rgba(23, 23, 23, 0.04)",
    description: "Cards, inputs at rest",
  },
  {
    name: "sm",
    cssVar: "--shadow-sm",
    value: "0 1px 4px 0 rgba(23, 23, 23, 0.04)",
    description: "Raised cards, dropdowns",
  },
  {
    name: "md",
    cssVar: "--shadow-md",
    value: "0 4px 6px -1px rgba(23, 23, 23, 0.08)",
    description: "Popovers, tooltips",
  },
  {
    name: "lg",
    cssVar: "--shadow-lg",
    value: "0 10px 15px -3px rgba(23, 23, 23, 0.08)",
    description: "Modals, drawers",
  },
  {
    name: "xl",
    cssVar: "--shadow-xl",
    value: "0 20px 25px -5px rgba(23, 23, 23, 0.08)",
    description: "Floating panels",
  },
  {
    name: "2xl",
    cssVar: "--shadow-2xl",
    value: "0 25px 50px 12px rgba(23, 23, 23, 0.08)",
    description: "High-elevation overlays",
  },
];

const cardStyle = {
  width: 240,
  height: 120,
  borderRadius: 12,
  backgroundColor: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 4,
};

const ShadowCard = ({ name, cssVar, value, description }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div
      style={{
        ...cardStyle,
        boxShadow: `var(${cssVar})`,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, color: "#1B1E1E" }}>shadow-{name}</span>
      <span style={{ fontSize: 11, color: "#8F8F8F", fontFamily: "monospace" }}>{value.split(")")[0]})</span>
    </div>
    <div style={{ paddingLeft: 4 }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: "#1B1E1E", fontFamily: "monospace" }}>
        shadow-{name}
      </div>
      <div style={{ fontSize: 11, color: "#8F8F8F", marginTop: 2 }}>{description}</div>
    </div>
  </div>
);

const ShadowShowcase = () => (
  <div style={{ padding: 32, maxWidth: 1100, backgroundColor: "#F8F8F8", minHeight: "100vh" }}>
    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#1B1E1E" }}>
      Shadows
    </h1>
    <p style={{ fontSize: 14, color: "#5F6161", marginBottom: 8 }}>
      Elevation tokens for depth and layering. Defined as{" "}
      <code style={{ fontSize: 12, background: "#EAEAEA", padding: "2px 6px", borderRadius: 4 }}>@theme</code> custom properties.
    </p>
    <p style={{ fontSize: 13, color: "#8F8F8F", marginBottom: 40 }}>
      Usage:{" "}
      <code style={{ fontSize: 12, background: "#EAEAEA", padding: "2px 6px", borderRadius: 4 }}>shadow-md</code>{" "}
      or{" "}
      <code style={{ fontSize: 12, background: "#EAEAEA", padding: "2px 6px", borderRadius: 4 }}>shadow-lg</code>
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 40 }}>
      {shadowTokens.map((t) => (
        <ShadowCard key={t.name} {...t} />
      ))}
    </div>

    <div style={{ marginTop: 56 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1B1E1E" }}>
        Token Reference
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, backgroundColor: "#FFFFFF", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #E5E5E5", textAlign: "left" }}>
            <th style={{ padding: "10px 16px", color: "#5F6161", fontWeight: 600 }}>Token</th>
            <th style={{ padding: "10px 16px", color: "#5F6161", fontWeight: 600 }}>X</th>
            <th style={{ padding: "10px 16px", color: "#5F6161", fontWeight: 600 }}>Y</th>
            <th style={{ padding: "10px 16px", color: "#5F6161", fontWeight: 600 }}>Blur</th>
            <th style={{ padding: "10px 16px", color: "#5F6161", fontWeight: 600 }}>Spread</th>
            <th style={{ padding: "10px 16px", color: "#5F6161", fontWeight: 600 }}>Color</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "2xs", x: "0", y: "1px", blur: "0", spread: "0", color: "rgba(0,0,0, 0.05)" },
            { name: "xs", x: "0", y: "1px", blur: "2px", spread: "0", color: "rgba(23,23,23, 0.04)" },
            { name: "sm", x: "0", y: "1px", blur: "4px", spread: "0", color: "rgba(23,23,23, 0.04)" },
            { name: "md", x: "0", y: "4px", blur: "6px", spread: "-1px", color: "rgba(23,23,23, 0.08)" },
            { name: "lg", x: "0", y: "10px", blur: "15px", spread: "-3px", color: "rgba(23,23,23, 0.08)" },
            { name: "xl", x: "0", y: "20px", blur: "25px", spread: "-5px", color: "rgba(23,23,23, 0.08)" },
            { name: "2xl", x: "0", y: "25px", blur: "50px", spread: "12px", color: "rgba(23,23,23, 0.08)" },
          ].map((row) => (
            <tr key={row.name} style={{ borderBottom: "1px solid #F0F0F0" }}>
              <td style={{ padding: "10px 16px", fontWeight: 500, fontFamily: "monospace" }}>shadow-{row.name}</td>
              <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "#5F6161" }}>{row.x}</td>
              <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "#5F6161" }}>{row.y}</td>
              <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "#5F6161" }}>{row.blur}</td>
              <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "#5F6161" }}>{row.spread}</td>
              <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "#5F6161" }}>{row.color}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default {
  title: "Foundations/Shadows",
  component: ShadowShowcase,
  parameters: {
    layout: "fullscreen",
  },
};

export const AllShadows = {
  render: () => <ShadowShowcase />,
};
