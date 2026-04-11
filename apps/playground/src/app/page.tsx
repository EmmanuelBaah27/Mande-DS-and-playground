import Link from "next/link";

const screens = [
  {
    name: "Home",
    path: "/screens/home",
    description: "Main landing screen with hero section and feature highlights",
  },
  {
    name: "Chat assistant",
    path: "/screens/chat",
    description: "AI career assistant with threaded conversations and session history",
  },
  {
    name: "Onboarding",
    path: "/screens/onboarding",
    description: "User onboarding flow with form inputs and progress steps",
  },
  {
    name: "Settings",
    path: "/screens/settings",
    description: "Settings page with form controls, toggles, and actions",
  },
];

export default function PlaygroundIndex() {
  return (
    <div className="min-h-screen p-2xl">
      <header className="mb-3xl w-[60vw] mx-auto">
        <h1 className="text-H1 text-neutral-900 mb-sm">Mande Playground</h1>
        <p className="text-lg-regular text-neutral-500">
          Prototype screens built with the Mande Design System. Click a screen
          to preview it.
        </p>
      </header>

      <main className="w-[60vw] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {screens.map((screen) => (
            <Link
              key={screen.path}
              href={screen.path}
              className="group block rounded-lg border border-neutral-200 bg-neutral-white p-xl hover:border-primary-400 hover:shadow-sm transition-all"
            >
              <div className="mb-md h-32 rounded-md bg-neutral-100 flex items-center justify-center">
                <span className="text-base-medium text-neutral-400">
                  Preview
                </span>
              </div>
              <h2 className="text-lg-semibold text-neutral-900 mb-2xs group-hover:text-primary-600">
                {screen.name}
              </h2>
              <p className="text-small-regular text-neutral-500">
                {screen.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-3xl p-xl rounded-lg border border-dashed border-neutral-300 text-center">
          <p className="text-base-medium text-neutral-400 mb-xs">
            Add a new screen
          </p>
          <p className="text-small-regular text-neutral-400">
            Create a new folder in{" "}
            <code className="bg-neutral-100 px-2xs py-3xs rounded text-small-medium">
              apps/playground/src/app/screens/your-screen/page.tsx
            </code>
          </p>
        </div>
      </main>
    </div>
  );
}
