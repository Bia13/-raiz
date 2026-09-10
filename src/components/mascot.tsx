import { cn } from "@/lib/utils";

type Expression = "neutral" | "greet" | "thinking";

const WOOL = "#f3ede0";
const FACE = "#c9793f";
const NOSE = "#a84a26";
const EYE = "#2a2823";

function Wool() {
  return (
    <>
      <circle cx="50" cy="46" r="30" fill={WOOL} />
      <circle cx="26" cy="36" r="13" fill={WOOL} />
      <circle cx="74" cy="36" r="13" fill={WOOL} />
      <circle cx="22" cy="52" r="11" fill={WOOL} />
      <circle cx="78" cy="52" r="11" fill={WOOL} />
      <circle cx="34" cy="26" r="11" fill={WOOL} />
      <circle cx="66" cy="26" r="11" fill={WOOL} />
    </>
  );
}

function Face({ expression }: { expression: Expression }) {
  const earRotation = expression === "greet" ? 30 : 18;
  return (
    <>
      <ellipse cx="50" cy="58" rx="19" ry="16" fill={FACE} />
      <ellipse
        cx="21"
        cy="47"
        rx="6.5"
        ry="9"
        fill={FACE}
        transform={`rotate(-${earRotation} 21 47)`}
      />
      <ellipse
        cx="79"
        cy="47"
        rx="6.5"
        ry="9"
        fill={FACE}
        transform={`rotate(${earRotation} 79 47)`}
      />
      {expression === "thinking" ? (
        <>
          <path d="M39 55h6M55 55h6" stroke={EYE} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="50" cy="64" rx="4" ry="3" fill={EYE} />
          <circle cx="63" cy="20" r="2" fill={FACE} />
          <circle cx="69" cy="16" r="1.4" fill={FACE} />
          <circle cx="74" cy="12" r="1" fill={FACE} />
        </>
      ) : expression === "greet" ? (
        <>
          <path d="M39 53q3-4 6 0" stroke={EYE} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M55 53q3-4 6 0" stroke={EYE} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M43 64q7 6 14 0" stroke={EYE} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="42" cy="55" r="2.6" fill={EYE} />
          <circle cx="58" cy="55" r="2.6" fill={EYE} />
          <path d="M44 65q6 5 12 0" stroke={EYE} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      <ellipse cx="50" cy="61" rx="3" ry="2" fill={NOSE} />
    </>
  );
}

export function Mascot({
  expression = "neutral",
  className,
}: {
  expression?: Expression;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-8 w-8", className)} aria-hidden>
      <Wool />
      <Face expression={expression} />
    </svg>
  );
}
