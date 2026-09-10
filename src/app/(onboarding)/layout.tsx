export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 py-8">
      {children}
    </div>
  );
}
