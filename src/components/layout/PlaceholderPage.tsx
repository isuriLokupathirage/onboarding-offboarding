export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-8 py-20 text-center">
      <h1 className="text-lg font-semibold text-ink">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        This part of the module hasn't been scoped yet — share the user story and it'll be built out next.
      </p>
    </div>
  );
}
