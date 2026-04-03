"use client";

import { Button, InputWithLabel, Checkbox, Chip } from "@mande/ui";

export default function SettingsScreen() {
  return (
    <div className="max-w-2xl mx-auto px-xl py-3xl">
      <h1 className="text-H1 text-neutral-900 mb-xs">Settings</h1>
      <p className="text-base-regular text-neutral-500 mb-3xl">
        Manage your account settings and preferences.
      </p>

      {/* Profile section */}
      <section className="mb-3xl">
        <h2 className="text-lg-semibold text-neutral-900 mb-lg pb-sm border-b border-neutral-200">
          Profile
        </h2>
        <div className="space-y-lg">
          <InputWithLabel label="Display name" id="displayName" defaultValue="Emmanuel" />
          <InputWithLabel label="Email" id="email" defaultValue="emmanuel@mande.dev" />
          <InputWithLabel label="Bio" id="bio" placeholder="Tell us about yourself" />
        </div>
      </section>

      {/* Notifications section */}
      <section className="mb-3xl">
        <h2 className="text-lg-semibold text-neutral-900 mb-lg pb-sm border-b border-neutral-200">
          Notifications
        </h2>
        <div className="space-y-md">
          <Checkbox label="Push notifications" subtext="Receive alerts on your device" defaultChecked />
          <Checkbox label="Email notifications" subtext="Get updates in your inbox" defaultChecked />
          <Checkbox label="SMS notifications" subtext="Receive text messages for urgent alerts" />
        </div>
      </section>

      {/* Interests section */}
      <section className="mb-3xl">
        <h2 className="text-lg-semibold text-neutral-900 mb-lg pb-sm border-b border-neutral-200">
          Interests
        </h2>
        <div className="flex flex-wrap gap-sm">
          <Chip variant="selected">Design</Chip>
          <Chip variant="selected">Engineering</Chip>
          <Chip>Marketing</Chip>
          <Chip>Product</Chip>
          <Chip variant="selected">AI</Chip>
          <Chip>Sales</Chip>
        </div>
      </section>

      {/* Actions */}
      <section className="flex justify-between pt-xl border-t border-neutral-200">
        <Button variant="destructive">Delete account</Button>
        <div className="flex gap-md">
          <Button variant="secondary">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </section>
    </div>
  );
}
