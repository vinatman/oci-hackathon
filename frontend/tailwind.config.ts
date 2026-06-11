import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        field: "#f5f7fb",
        action: "#0f766e",
        amberline: "#f59e0b",
        coral: "#ef6351"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(24, 33, 47, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
