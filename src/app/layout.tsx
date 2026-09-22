import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://clippership.co"),
  title: {
    default: "Clippership - AI compute at the maritime edge",
    template: "%s - Clippership",
  },
  description:
    "Clippership builds autonomous sail freighters that carry AI compute onto the open ocean, where clean energy and cooling are plentiful.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* suppressHydrationWarning: the hero's inline intro script stamps
       data-intro on <html> before React hydrates. */
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-surface text-text-strong flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
