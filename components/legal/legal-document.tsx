import Link from "next/link";
import type { ReactNode } from "react";

export function LegalDocument({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <article className="bg-gradient-to-b from-[#eef2f8] to-white px-6 pb-24 pt-20 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-[#083D6B] transition-colors hover:text-[#E6B31E]"
        >
          ← Back to home
        </Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#E6B31E]">Legal</p>
        <h1 className="mt-2 font-[family-name:var(--font-montserrat)] text-3xl font-bold tracking-tight text-[#083D6B] md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-[#42474f]">Last updated: {lastUpdated}</p>
        <div className="mt-12 space-y-12 border-t border-[#083D6B]/10 pt-12">{children}</div>
      </div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-[#083D6B] md:text-[1.35rem]">
        {title}
      </h2>
      <div className="space-y-3 text-base leading-[1.65] text-[#42474f]">{children}</div>
    </section>
  );
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-2 font-[family-name:var(--font-montserrat)] text-base font-semibold text-[#083D6B]">
      {children}
    </h3>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2.5 pl-5 marker:text-[#E6B31E]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
