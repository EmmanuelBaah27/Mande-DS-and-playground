import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const config: StorybookConfig = {
  stories: [
    "../packages/ui/src/**/*.mdx",
    "../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());
    config.plugins.push(react());

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../packages/ui/src"),
    };

    // Serving Storybook through a reverse proxy (Claude Code cloud,
    // Codespaces, ngrok, etc.) requires binding all interfaces,
    // accepting arbitrary forwarder hostnames, and pointing the HMR
    // client at the user-facing origin instead of the container's
    // internal port. Without this, the preview iframe emits absolute
    // URLs against localhost:6006 which don't resolve in the user's
    // browser, surfacing as "Failed to fetch dynamically imported
    // module" errors.
    config.server = {
      ...config.server,
      host: true,
      allowedHosts: true,
      hmr: {
        ...(typeof config.server?.hmr === "object" ? config.server.hmr : {}),
        protocol: "wss",
        clientPort: 443,
      },
    };

    config.cacheDir = path.resolve(__dirname, "../node_modules/.cache/sb-vite");

    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include ?? []),
        "@radix-ui/react-accordion",
        "@radix-ui/react-alert-dialog",
        "@radix-ui/react-aspect-ratio",
        "@radix-ui/react-avatar",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-collapsible",
        "@radix-ui/react-context-menu",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-hover-card",
        "@radix-ui/react-label",
        "@radix-ui/react-menubar",
        "@radix-ui/react-navigation-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-progress",
        "@radix-ui/react-radio-group",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slider",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-toggle",
        "@radix-ui/react-toggle-group",
        "@radix-ui/react-tooltip",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "cmdk",
        "react-day-picker",
        "react-hook-form",
        "recharts",
        "embla-carousel-react",
        "input-otp",
        "vaul",
        "react-resizable-panels",
      ],
    };

    return config;
  },
};

export default config;
