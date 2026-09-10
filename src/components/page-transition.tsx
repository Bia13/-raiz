import { ViewTransition } from "react";

const DIRECTIONAL = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

/**
 * Wrap a route's page content so Link navigations tagged with
 * transitionTypes={["nav-forward" | "nav-back"]} slide/fade between steps.
 * Must be used in page.tsx (not layout.tsx) — see Next's view-transitions guide.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={DIRECTIONAL} exit={DIRECTIONAL} default="none">
      {children}
    </ViewTransition>
  );
}
