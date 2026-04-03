"use client";

import { useState } from "react";
import { Button, InputWithLabel, Checkbox } from "@mande/ui";

const steps = ["Account", "Profile", "Preferences"];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="max-w-md mx-auto px-xl py-5xl">
      {/* Progress */}
      <div className="flex items-center gap-sm mb-3xl">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-sm">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-small-semibold ${
                i <= currentStep
                  ? "bg-primary-500 text-neutral-black"
                  : "bg-neutral-200 text-neutral-400"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-small-medium ${
                i <= currentStep ? "text-neutral-900" : "text-neutral-400"
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div className="w-8 h-px bg-neutral-200" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="mb-3xl">
        <h1 className="text-H2 text-neutral-900 mb-xs">
          {currentStep === 0 && "Create your account"}
          {currentStep === 1 && "Set up your profile"}
          {currentStep === 2 && "Choose your preferences"}
        </h1>
        <p className="text-base-regular text-neutral-500 mb-2xl">
          {currentStep === 0 && "Enter your details to get started."}
          {currentStep === 1 && "Tell us a bit about yourself."}
          {currentStep === 2 && "Customize your experience."}
        </p>

        <div className="space-y-lg">
          {currentStep === 0 && (
            <>
              <InputWithLabel label="Email" id="email" placeholder="you@example.com" />
              <InputWithLabel label="Password" id="password" type="password" placeholder="Create a password" />
            </>
          )}
          {currentStep === 1 && (
            <>
              <InputWithLabel label="Full name" id="name" placeholder="Your name" />
              <InputWithLabel label="Role" id="role" placeholder="e.g. Product Designer" />
            </>
          )}
          {currentStep === 2 && (
            <div className="space-y-md">
              <Checkbox label="Email notifications" subtext="Get updates about new features" />
              <Checkbox label="Weekly digest" subtext="Summary of your team's activity" />
              <Checkbox label="Marketing emails" subtext="Tips and best practices" />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="tertiary"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={() =>
            setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
          }
        >
          {currentStep === steps.length - 1 ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
