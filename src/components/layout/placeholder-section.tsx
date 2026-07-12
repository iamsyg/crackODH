type PlaceholderSectionProps = {
  title: string;
  items: string[];
};

export function PlaceholderSection({ title, items }: PlaceholderSectionProps) {
  return (
    <section className="rounded-xl border border-dashed border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
