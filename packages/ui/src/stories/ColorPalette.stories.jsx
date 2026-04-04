const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const neutralShades = ["white", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const alphaShades = ["a4", "a8", "a16"];

const palettes = [
  { name: "Neutral", prefix: "neutral", shades: neutralShades },
  { name: "Neutral (Transparent)", prefix: "neutral", shades: alphaShades },
  { name: "Lime", prefix: "lime", shades },
  { name: "Teal", prefix: "teal", shades },
  { name: "Blush", prefix: "blush", shades },
  { name: "Orange", prefix: "orange", shades },
  { name: "Blue", prefix: "blue", shades },
  { name: "Red", prefix: "red", shades },
  { name: "Green", prefix: "green", shades },
  { name: "Yellow", prefix: "yellow", shades },
];

const Swatch = ({ prefix, shade }) => {
  const varName = `--color-${prefix}-${shade}`;
  const isAlpha = shade.includes("alpha");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 8,
          backgroundColor: `var(${varName})`,
          border: "1px solid rgba(0,0,0,0.08)",
          ...(isAlpha ? { backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)", backgroundSize: "8px 8px", backgroundPosition: "0 0, 4px 4px" } : {}),
        }}
      >
        {isAlpha && (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              backgroundColor: `var(${varName})`,
            }}
          />
        )}
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color: "#5F6161" }}>{shade}</span>
      <span style={{ fontSize: 9, color: "#8F8F8F", fontFamily: "monospace" }}>{varName}</span>
    </div>
  );
};

const PaletteRow = ({ name, prefix, shades: paletteShades }) => (
  <div style={{ marginBottom: 40 }}>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#1B1E1E" }}>{name}</h3>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {paletteShades.map((shade) => (
        <Swatch key={`${prefix}-${shade}`} prefix={prefix} shade={shade} />
      ))}
    </div>
  </div>
);

const ColorPalette = () => (
  <div style={{ padding: 24, maxWidth: 900 }}>
    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#1B1E1E" }}>Color Primitives</h1>
    <p style={{ fontSize: 14, color: "#5F6161", marginBottom: 32 }}>
      All palettes in OKLCH format. 500 is the seed color from Figma, shades generated via tints.dev.
    </p>
    {palettes.map((p) => (
      <PaletteRow key={p.name} {...p} />
    ))}
  </div>
);

export default {
  title: "Foundations/Color Palette",
  component: ColorPalette,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "neutral-white" },
  },
};

export const AllColors = {
  render: () => <ColorPalette />,
};
