import { useState, useMemo } from "react"
import { CentralIcon } from "@central-icons-react/all"
import { ICON_CATEGORIES } from "./icon-categories.js"

const TOTAL = Object.values(ICON_CATEGORIES).reduce((n, arr) => n + arr.length, 0)

// Flatten all icons with their category
const ALL_ICONS = Object.entries(ICON_CATEGORIES).flatMap(([category, icons]) =>
  icons.map((name) => ({ name, category }))
)

const CATEGORIES = ["All", ...Object.keys(ICON_CATEGORIES)]

const FILLS = ["outlined", "filled"]

// ─── Styles ──────────────────────────────────────────────────────────────────

const containerStyle = {
  padding: 24,
  backgroundColor: "#F5F5F5",
  minHeight: "100vh",
  fontFamily: "Inter, system-ui, sans-serif",
}

const headerStyle = {
  marginBottom: 24,
}

const controlsStyle = {
  display: "flex",
  gap: 12,
  marginBottom: 24,
  flexWrap: "wrap",
  alignItems: "center",
}

const inputStyle = {
  height: 36,
  padding: "0 12px",
  border: "1px solid #DCDCDC",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  backgroundColor: "#fff",
  width: 240,
  color: "#1B1E1E",
}

const selectStyle = {
  height: 36,
  padding: "0 12px",
  border: "1px solid #DCDCDC",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  backgroundColor: "#fff",
  color: "#1B1E1E",
  cursor: "pointer",
}

const countStyle = {
  fontSize: 12,
  color: "#8F8F8F",
  marginLeft: "auto",
  alignSelf: "center",
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
  gap: 8,
}

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  padding: "16px 8px 12px",
  backgroundColor: "#fff",
  borderRadius: 10,
  border: "1px solid #EBEBEB",
  cursor: "pointer",
  transition: "border-color 0.1s",
  minWidth: 0,
}

const nameStyle = {
  fontSize: 10,
  color: "#5F6161",
  textAlign: "center",
  wordBreak: "break-all",
  lineHeight: 1.3,
  fontFamily: "monospace",
}

const tooltipStyle = {
  position: "fixed",
  bottom: 24,
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#1B1E1E",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "monospace",
  pointerEvents: "none",
  zIndex: 9999,
  whiteSpace: "nowrap",
}

// ─── Component ────────────────────────────────────────────────────────────────

const IconBrowser = () => {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [fill, setFill] = useState("outlined")
  const [copied, setCopied] = useState(null)

  const filtered = useMemo(() => {
    return ALL_ICONS.filter((icon) => {
      const matchesQuery = icon.name.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === "All" || icon.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  const handleClick = (name) => {
    navigator.clipboard.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1B1E1E", marginBottom: 4 }}>
          Icon Browser
        </h1>
        <p style={{ fontSize: 13, color: "#5F6161" }}>
          {TOTAL.toLocaleString()} icons · Central Icons · stroke 2 · radius 2 · Click any icon to copy its name
        </p>
      </div>

      <div style={controlsStyle}>
        <input
          style={inputStyle}
          placeholder="Search icons…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          style={selectStyle}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div style={{ display: "flex", gap: 4 }}>
          {FILLS.map((f) => (
            <button
              key={f}
              onClick={() => setFill(f)}
              style={{
                height: 36,
                padding: "0 14px",
                border: "1px solid",
                borderColor: fill === f ? "#1B1E1E" : "#DCDCDC",
                borderRadius: 8,
                fontSize: 13,
                backgroundColor: fill === f ? "#1B1E1E" : "#fff",
                color: fill === f ? "#fff" : "#5F6161",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <span style={countStyle}>{filtered.length.toLocaleString()} icons</span>
      </div>

      <div style={gridStyle}>
        {filtered.map(({ name }) => (
          <div
            key={name}
            style={cardStyle}
            onClick={() => handleClick(name)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#AAAAAA" }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EBEBEB" }}
          >
            <CentralIcon
              name={name}
              size={20}
              fill={fill}
              stroke="2"
              join="round"
              radius="2"
            />
            <span style={nameStyle}>{name.replace(/^Icon/, "")}</span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#8F8F8F", fontSize: 14 }}>
          No icons match "{query}"
        </div>
      )}

      {copied && (
        <div style={tooltipStyle}>
          Copied: {copied}
        </div>
      )}
    </div>
  )
}

export default {
  title: "Foundations/Icon Browser",
  component: IconBrowser,
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
  },
}

export const Browser = {
  render: () => <IconBrowser />,
}
