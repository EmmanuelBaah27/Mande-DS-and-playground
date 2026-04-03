"use client";

import { Button, Chip } from "@mande/ui";
import { ArrowRight, Star, Lightning, ShieldCheck } from "@phosphor-icons/react";

export default function HomeScreen() {
  return (
    <div className="max-w-4xl mx-auto px-xl py-3xl">
      {/* Hero */}
      <section className="mb-5xl text-center">
        <div className="flex justify-center gap-sm mb-xl">
          <Chip>Design</Chip>
          <Chip>Build</Chip>
          <Chip>Ship</Chip>
        </div>
        <h1 className="text-H1 text-neutral-900 mb-md">
          Build better products, faster
        </h1>
        <p className="text-lg-regular text-neutral-500 max-w-xl mx-auto mb-2xl">
          A complete design system for teams that want to move fast without
          sacrificing quality.
        </p>
        <div className="flex justify-center gap-md">
          <Button icon={<ArrowRight />} iconPosition="right">
            Get started
          </Button>
          <Button variant="secondary">Learn more</Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {[
          {
            icon: <Star size={24} />,
            title: "Consistent",
            description:
              "Every component follows the same design tokens and patterns.",
          },
          {
            icon: <Lightning size={24} />,
            title: "Fast",
            description:
              "Pre-built components so you can prototype in minutes, not hours.",
          },
          {
            icon: <ShieldCheck size={24} />,
            title: "Accessible",
            description:
              "Built with accessibility in mind — focus states, ARIA, and keyboard nav.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="p-xl rounded-lg border border-neutral-200 bg-neutral-white"
          >
            <div className="mb-md text-primary-600">{feature.icon}</div>
            <h3 className="text-lg-semibold text-neutral-900 mb-xs">
              {feature.title}
            </h3>
            <p className="text-base-regular text-neutral-500">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
