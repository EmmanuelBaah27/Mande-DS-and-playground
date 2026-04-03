import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function ScreensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-white/80 backdrop-blur-sm px-xl py-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-xs text-base-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to all screens
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
