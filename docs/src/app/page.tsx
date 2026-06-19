
"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import WireframePlanet from "@/components/wireframe-planet";
import TwinklingStars from "@/components/twinkling-stars";
import LandingNavbar from "@/components/landing-navbar";
// import { Contributor } from "@/components/contributor";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CodeBlock({
  code,
  label,
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl border border-foreground/10 bg-foreground/[0.03] backdrop-blur-sm overflow-hidden">
      {label && (
        <div className="px-4 py-2 border-b border-foreground/10 text-xs text-muted-foreground font-mono">
          {label}
        </div>
      )}
      <div className="px-4 py-3 font-mono text-sm text-foreground/80 overflow-x-auto">
        <pre className="whitespace-pre">{code}</pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <CheckIcon className="text-green-500" />
        ) : (
          <CopyIcon className="text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
    title: "Beautiful by Default",
    description:
      "Components designed with a lunar-inspired aesthetic. Dark mode first, with elegant light mode support.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" />
      </svg>
    ),
    title: "Cross Platform",
    description:
      "Write once, run on both React Native and Web. Powered by NativeWind for consistent styling.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
    title: "Developer Experience",
    description:
      "TypeScript-first, fully typed props, auto-complete support, and comprehensive documentation.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Accessible",
    description:
      "Built with accessibility in mind. ARIA attributes, keyboard navigation, and screen reader support.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
      </svg>
    ),
    title: "Themeable",
    description:
      "Fully customizable theme system. Override colors, spacing, typography, and more through simple config.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
    title: "Performant",
    description:
      "Optimized for performance with minimal re-renders, lazy loading, and efficient animations.",
  },
];

const emptySubscribe = () => () => { };

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function Page() {
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Floating Navbar */}
      <LandingNavbar />

      {/* Twinkling Stars */}
      <TwinklingStars count={180} dark={isDark} />

      {/* ===== HERO / JUMBOTRON ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Wireframe Planet — behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Glow */}
          <div
            className={`absolute w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[700px] md:h-[700px] rounded-full blur-[100px] ${isDark ? "bg-white/[0.015]" : "bg-foreground/[0.04]"
              }`}
          />
          <div className="w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[700px] md:h-[700px]">
            <WireframePlanet dark={isDark} />
          </div>
        </div>

        {/* Content — on top of planet */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="mb-6 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] backdrop-blur-md text-xs text-muted-foreground tracking-widest uppercase">
            React Native &middot; Web &middot; UI Kit
          </div>

          {/* Heading */}
          <h1 className="text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1.05]">
            <span
              className={`bg-clip-text text-transparent ${isDark
                ? "bg-gradient-to-b from-white via-white/90 to-white/40 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                : "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-400"
                }`}
            >
              Lunar Kit
            </span>
          </h1>

          <p className="mt-6 text-center text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            A universal component library for React Native and Web.
            <br className="hidden sm:block" />
            Beautiful, accessible, and built for the modern stack.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/docs/getting-started"
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity text-center"
            >
              Get Started
            </Link>
            <Link
              href="/docs/components/button"
              className="px-8 py-3 rounded-xl border border-foreground/15 text-foreground/80 font-semibold text-sm hover:bg-foreground/5 transition-colors text-center backdrop-blur-sm"
            >
              Browse Components
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce z-10">
          <span className="text-xs text-muted-foreground/50 tracking-widest uppercase">
            Scroll
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground/50"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ===== INSTALL / IMPORT SECTION ===== */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent ${isDark
                ? "bg-gradient-to-b from-white to-white/60"
                : "bg-gradient-to-b from-gray-900 to-gray-500"
                }`}
            >
              Ship in Minutes
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Get started with a single install command. Import components and
              build beautiful interfaces instantly.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {/* Step 1 - Install */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-sm font-mono text-muted-foreground">
                1
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-foreground/70 text-sm font-medium">
                  Install the package
                </p>
                <CodeBlock code="npx lunar-kit init" label="Terminal" />
              </div>
            </div>

            {/* Step 2 - Add components */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-sm font-mono text-muted-foreground">
                2
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-foreground/70 text-sm font-medium">
                  Add the components you need
                </p>
                <CodeBlock
                  code="npx lunar-kit add button card input"
                  label="Terminal"
                />
              </div>
            </div>

            {/* Step 3 - Import */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-sm font-mono text-muted-foreground">
                3
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-foreground/70 text-sm font-medium">
                  Import and start building
                </p>
                <CodeBlock
                  code={`import { Button } from "@/lunar-kit/components/button";\nimport { Card } from "@/lunar-kit/components/card";\n\nexport default function App() {\n  return (\n    <Card>\n      <Button variant="primary">\n        Launch 🚀\n      </Button>\n    </Card>\n  );\n}`}
                  label="App.tsx"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE LUNAR KIT ===== */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent ${isDark
                ? "bg-gradient-to-b from-white to-white/60"
                : "bg-gradient-to-b from-gray-900 to-gray-500"
                }`}
            >
              Why Lunar Kit?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to build polished, cross-platform apps —
              without the headache.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] backdrop-blur-sm p-6 hover:border-foreground/15 hover:bg-foreground/[0.04] transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4 w-10 h-10 rounded-xl bg-foreground/[0.06] flex items-center justify-center text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground/90 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTRIBUTORS ===== */}
      {/* <section className="relative z-10 py-32 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent ${isDark
                ? "bg-gradient-to-b from-white to-white/60"
                : "bg-gradient-to-b from-gray-900 to-gray-500"
              }`}
          >
            Contributors
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Thank you to all the contributors who have helped make Lunar Kit
            possible.
          </p>
          <Contributor />
        </div>
      </section> */}

      {/* ===== FOOTER CTA ===== */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent ${isDark
              ? "bg-gradient-to-b from-white to-white/60"
              : "bg-gradient-to-b from-gray-900 to-gray-500"
              }`}
          >
            Ready to Launch?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start building beautiful cross-platform apps today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Read the Docs
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl border border-foreground/15 text-foreground/80 font-semibold text-sm hover:bg-foreground/5 transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-foreground/[0.06] py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Lunar Kit. Built with care.
          </p>
          <div className="flex gap-6">
            <Link
              href="/docs"
              className="text-sm text-muted-foreground/60 hover:text-foreground/60 transition-colors"
            >
              Docs
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground/60 hover:text-foreground/60 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}