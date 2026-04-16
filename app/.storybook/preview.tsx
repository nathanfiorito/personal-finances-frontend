import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import "../src/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0b0b0d" },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile (375)",
          styles: { width: "375px", height: "812px" },
        },
        tablet: {
          name: "Tablet (768)",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop (1440)",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
    a11y: { test: "todo" },
  },
  globalTypes: {
    theme: {
      description: "Theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", theme === "dark");
      }
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <div className="bg-background text-foreground min-h-screen w-full">
              <Story />
            </div>
          </MemoryRouter>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
