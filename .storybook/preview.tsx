import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";
      return (
        <div className={theme === "dark" ? "dark" : ""} style={{ background: theme === "dark" ? "#09090B" : "#ffffff", minHeight: "100vh", padding: "24px" }}>
          <Story />
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
