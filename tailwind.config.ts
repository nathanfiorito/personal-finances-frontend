import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
        },
        dark: {
          bg:        "#09090B",
          surface:   "#18181B",
          surface2:  "#27272A",
          border:    "#3F3F46",
          muted:     "#71717A",
          secondary: "#A1A1AA",
          primary:   "#F4F4F5",
        },
        success: {
          DEFAULT: "#16A34A",
          dark:    "#22C55E",
          bg:      "#F0FDF4",
          "bg-dark": "#052E16",
        },
        danger: {
          DEFAULT: "#DC2626",
          dark:    "#EF4444",
          bg:      "#FEF2F2",
          "bg-dark": "#450A0A",
        },
        warning: {
          DEFAULT: "#D97706",
          dark:    "#F59E0B",
          bg:      "#FFFBEB",
          "bg-dark": "#1C1400",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm:   "4px",
        DEFAULT: "6px",
        md:   "8px",
        lg:   "12px",
        xl:   "16px",
        "2xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        DEFAULT: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
        md: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)",
        lg: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
      },
      // Cores fixas para gráficos (Recharts)
      // Acesse via: chartColors[categoria]
    },
  },
  plugins: [],
};

export default config;
