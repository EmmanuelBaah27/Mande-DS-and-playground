import Link from "next/link";
import { Icon } from "@mande/ui";
import type { IconName } from "@mande/ui";

type Screen = {
  name: string;
  path: string;
  description: string;
  icon: IconName;
};

const activeScreens: Screen[] = [
  {
    name: "Home",
    path: "/screens/home",
    description: "Main landing screen with hero section and feature highlights",
    icon: "IconHome",
  },
  {
    name: "Chat assistant",
    path: "/screens/chat",
    description: "AI career assistant with threaded conversations and session history",
    icon: "IconBubbleSparkle",
  },
  {
    name: "Career discovery",
    path: "/screens/career-discovery",
    description: "Guided career clarity flow with pivot factors and progress",
    icon: "IconCompassRound",
  },
];

const inactiveScreens: Screen[] = [
  {
    name: "Onboarding",
    path: "/screens/onboarding",
    description: "User onboarding flow with form inputs and progress steps",
    icon: "IconCirclePerson",
  },
  {
    name: "Settings",
    path: "/screens/settings",
    description: "Settings page with form controls, toggles, and actions",
    icon: "IconSettingsToggle1",
  },
];

function ScreenCard({ screen, inactive = false }: { screen: Screen; inactive?: boolean }) {
  return (
    <Link
      key={screen.path}
      href={screen.path}
      className={
        inactive
          ? "group block rounded-2 border border-neutral-200 bg-neutral-white p-5 hover:border-neutral-300 hover:shadow-sm transition-all opacity-60 hover:opacity-100"
          : "group block rounded-2 border border-neutral-200 bg-neutral-white p-5 hover:border-primary-400 hover:shadow-sm transition-all"
      }
    >
      <div className="mb-3">
        <Icon
          name={screen.icon}
          size={20}
          className={
            inactive
              ? "text-neutral-400 group-hover:text-neutral-500"
              : "text-neutral-400 group-hover:text-primary-600"
          }
        />
      </div>
      <h2
        className={
          inactive
            ? "text-base-semibold text-neutral-700 mb-1 group-hover:text-neutral-900"
            : "text-base-semibold text-neutral-900 mb-1 group-hover:text-primary-600"
        }
      >
        {screen.name}
      </h2>
      <p className="text-small-regular text-neutral-500">{screen.description}</p>
    </Link>
  );
}

export default function PlaygroundIndex() {
  return (
    <div className="min-h-screen p-8">
      <header className="pt-8 mb-8 w-[60vw] mx-auto">
        <h1 className="text-H1 text-neutral-900 mb-2">Mande Playground</h1>
        <p className="text-base-regular text-neutral-500">
          Prototype screens built with the Mande Design System. Click a screen
          to preview it.
        </p>
      </header>

      <main className="w-[60vw] mx-auto flex flex-col gap-10">
        <section>
          <h2 className="text-sm-semibold text-neutral-900 uppercase tracking-wide mb-3">
            Active
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeScreens.map((screen) => (
              <ScreenCard key={screen.path} screen={screen} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm-semibold text-neutral-500 uppercase tracking-wide mb-3">
            Inactive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveScreens.map((screen) => (
              <ScreenCard key={screen.path} screen={screen} inactive />
            ))}
          </div>
        </section>

        <p className="text-small-regular text-neutral-400">
          Add a screen by creating a new folder in{" "}
          <code className="bg-neutral-100 px-1 py-0.5 rounded-1 text-small-medium">
            apps/playground/src/app/screens/your-screen/page.tsx
          </code>
        </p>
      </main>
    </div>
  );
}
