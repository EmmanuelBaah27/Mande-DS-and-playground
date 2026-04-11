import type { Metadata } from "next";
import "./globals.css";
import { AgentationProvider } from "./agentation-provider";

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
        <AgentationProvider />
      </body>
    </html>
  );
}
