import type { Metadata } from "next";
import "./globals.css";
import "dialkit/styles.css";
import { AgentationProvider } from "./agentation-provider";
import { DialRoot } from "dialkit";

export const metadata: Metadata = {
  title: "Mande Playground",
  description: "Prototype screens using the Mande Design System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900">
        {children}
        <DialRoot />
        <AgentationProvider />
      </body>
    </html>
  );
}
