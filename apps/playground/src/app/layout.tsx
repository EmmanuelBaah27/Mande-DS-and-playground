import type { Metadata } from "next";
import "./globals.css";
import "dialkit/styles.css";
import { Toaster } from "@mande/ui";
import { AgentationProvider } from "./agentation-provider";
import { DialKitProvider } from "./dialkit-provider";

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
        <Toaster />
        <DialKitProvider />
        <AgentationProvider />
      </body>
    </html>
  );
}
