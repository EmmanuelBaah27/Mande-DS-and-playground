import React from "react";

const headings = [
  { name: "H1", className: "text-H1", description: "28 / 24 / 20 px" },
  { name: "H2", className: "text-H2", description: "24 / 20 / 18 px" },
  { name: "H3", className: "text-H3", description: "20 / 18 / 18 px" },
];

const bodyStyles = [
  { name: "xlarge / regular", className: "text-xlg-regular" },
  { name: "xlarge / medium", className: "text-xlg-medium" },
  { name: "xlarge / semibold", className: "text-xlg-semibold" },
  { name: "large / regular", className: "text-lg-regular" },
  { name: "large / medium", className: "text-lg-medium" },
  { name: "large / semibold", className: "text-lg-semibold" },
  { name: "base / regular", className: "text-base-regular" },
  { name: "base / medium", className: "text-base-medium" },
  { name: "base / semibold", className: "text-base-semibold" },
  { name: "small / regular", className: "text-small-regular" },
  { name: "small / medium", className: "text-small-medium" },
  { name: "small / semibold", className: "text-small-semibold" },
];

const sampleText = "The quick brown fox jumps over the lazy dog";

const tokenRow = {
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  alignItems: "baseline",
  gap: 16,
  padding: "12px 0",
  borderBottom: "1px solid var(--color-neutral-200)",
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 500,
  color: "#5F6161",
  fontFamily: "monospace",
};

const metaStyle = {
  fontSize: 11,
  color: "#8F8F8F",
  fontFamily: "monospace",
  marginTop: 4,
};

const HeadingRow = ({ name, className, description }) => {
  return (
    <div style={tokenRow}>
      <div>
        <div style={labelStyle}>.{className}</div>
        <div style={metaStyle}>{description}</div>
        <div style={{ ...metaStyle, fontSize: 10 }}>desktop / tablet / mobile</div>
      </div>
      <div className={className} style={{ color: "#1B1E1E" }}>
        {sampleText}
      </div>
    </div>
  );
};

const BodyRow = ({ name, className }) => {
  return (
    <div style={tokenRow}>
      <div>
        <div style={labelStyle}>.{className}</div>
        <div style={metaStyle}>{name}</div>
      </div>
      <div className={className} style={{ color: "#1B1E1E" }}>
        {sampleText}
      </div>
    </div>
  );
};

const TypographyShowcase = () => (
  <div style={{ padding: 24, maxWidth: 1000 }}>
    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#1B1E1E" }}>
      Typography
    </h1>
    <p style={{ fontSize: 14, color: "#5F6161", marginBottom: 32 }}>
      Inter font family. Headings scale responsively across desktop, tablet, and mobile breakpoints.
      Body styles are consistent across all breakpoints.
    </p>

    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1B1E1E" }}>
      Headings
    </h2>
    <div style={{ marginBottom: 40 }}>
      {headings.map((h) => (
        <HeadingRow key={h.name} {...h} />
      ))}
    </div>

    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1B1E1E" }}>
      Body
    </h2>
    <div style={{ marginBottom: 40 }}>
      {bodyStyles.map((b) => (
        <BodyRow key={b.className} {...b} />
      ))}
    </div>

    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1B1E1E" }}>
      Token Reference
    </h2>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--color-neutral-300)", textAlign: "left" }}>
          <th style={{ padding: "8px 12px", color: "#5F6161", fontWeight: 600 }}>Scale</th>
          <th style={{ padding: "8px 12px", color: "#5F6161", fontWeight: 600 }}>Size</th>
          <th style={{ padding: "8px 12px", color: "#5F6161", fontWeight: 600 }}>Line Height</th>
          <th style={{ padding: "8px 12px", color: "#5F6161", fontWeight: 600 }}>Weight</th>
          <th style={{ padding: "8px 12px", color: "#5F6161", fontWeight: 600 }}>Para Spacing</th>
        </tr>
      </thead>
      <tbody>
        {[
          { scale: "H1", size: "28px", lh: "36px", weight: "600", ps: "24px" },
          { scale: "H2", size: "24px", lh: "32px", weight: "600", ps: "20px" },
          { scale: "H3", size: "20px", lh: "28px", weight: "600", ps: "18px" },
          { scale: "xlarge", size: "18px", lh: "26px", weight: "400 / 500 / 600", ps: "20px" },
          { scale: "large", size: "16px", lh: "24px", weight: "400 / 500 / 600", ps: "16px" },
          { scale: "base", size: "14px", lh: "20px", weight: "400 / 500 / 600", ps: "14px" },
          { scale: "small", size: "12px", lh: "18px", weight: "400 / 500 / 600", ps: "\u2014" },
        ].map((row) => (
          <tr key={row.scale} style={{ borderBottom: "1px solid var(--color-neutral-200)" }}>
            <td style={{ padding: "8px 12px", fontWeight: 500 }}>{row.scale}</td>
            <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{row.size}</td>
            <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{row.lh}</td>
            <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{row.weight}</td>
            <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{row.ps}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default {
  title: "Foundations/Typography",
  component: TypographyShowcase,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "neutral-white" },
  },
};

export const AllStyles = {
  render: () => <TypographyShowcase />,
};
