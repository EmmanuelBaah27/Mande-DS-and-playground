import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
    };

    // Ensure CSS is processed by PostCSS (Tailwind v4) so design tokens and utilities apply
    const findCssRule = (rules: unknown[]): { rule: unknown; use: unknown[] } | null => {
      for (const rule of rules) {
        if (typeof rule !== "object" || rule === null) continue;
        const r = rule as Record<string, unknown>;
        if (r.oneOf && Array.isArray(r.oneOf)) {
          const found = findCssRule(r.oneOf);
          if (found) return found;
        }
        if (r.test && r.test instanceof RegExp && r.test.toString().includes("css")) {
          const use = r.use
            ? Array.isArray(r.use)
              ? r.use
              : [r.use]
            : r.loader
              ? [r.loader]
              : [];
          return { rule: r, use };
        }
      }
      return null;
    };

    const rules = config.module?.rules ?? [];
    const found = findCssRule(rules);
    if (found) {
      const { use } = found;
      const hasPostcss = use.some(
        (u) =>
          typeof u === "object" &&
          u !== null &&
          "loader" in (u as object) &&
          String((u as { loader?: string }).loader).includes("postcss")
      );
      if (!hasPostcss) {
        (found.rule as Record<string, unknown>).use = [
          ...use,
          {
            loader: require.resolve("postcss-loader"),
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, ".."),
              },
            },
          },
        ];
      }
    }

    return config;
  },
};

export default config;
