import "./preview.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "neutral-50",
      values: [
        { name: "neutral-50", value: "hsl(0 0% 98%)" },
        { name: "neutral-white", value: "#ffffff" },
        { name: "neutral-900", value: "#141414" },
      ],
    },
    layout: "centered",
  },
};

export default preview;
