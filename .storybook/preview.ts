import "../src/app/globals.css";

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
        { name: "neutral-900", value: "hsl(180 4% 11%)" },
      ],
    },
    layout: "centered",
  },
};

export default preview;
