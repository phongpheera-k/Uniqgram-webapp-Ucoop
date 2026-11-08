import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "neutral",
      values: [
        { name: "neutral", value: "#F3F5F7" },
        { name: "white", value: "#FFFFFF" },
        { name: "slate", value: "#10202B" },
      ],
    },
    a11y: {
      test: "todo",
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile (iPhone 14)",
          styles: { width: "390px", height: "844px" },
        },
        tablet: {
          name: "Tablet (iPad Mini)",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop (1440p)",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
  },
};

export default preview;
