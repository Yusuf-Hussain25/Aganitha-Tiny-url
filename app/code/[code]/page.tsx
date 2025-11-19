import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getLink } from "@/lib/links";

type Params = {
  params: {
    code: string;
  };
};

export const dynamic = "force-dynamic";

export default async function CodeStatsPage({ params }: Params) {
  const link = await getLink(params.code);

  if (!link) {
    notFound();
  }

  const host = headers().get("host") ?? "localhost:3000";
  const protocol = headers().get("x-forwarded-proto") ?? "http";
  const shortUrl = `${protocol}://${host}/${link.code}`;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-10">
      <div>
        <p className="text-sm text-zinc-500">
          Stats for shortcode{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {link.code}
          </span>
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          {link.code} overview
        </h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <StatCard label="Destination URL">
          <a
            href={link.targetUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate text-blue-600 underline-offset-2 hover:underline"
          >
            {link.targetUrl}
          </a>
        </StatCard>

        <StatCard label="Short URL">
          <span className="font-mono">{shortUrl}</span>
        </StatCard>

        <StatCard label="Total clicks" highlight>
          {link.totalClicks}
        </StatCard>

        <StatCard label="Last clicked">
          {link.lastClickedAt
            ? formatDate(link.lastClickedAt)
            : "Never clicked"}
        </StatCard>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-100"
        >
          ← Back to dashboard
        </Link>
        <a
          href={`/${link.code}`}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Visit short link
        </a>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatCard({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40 ${
        highlight ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <div className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {children}
      </div>
    </div>
  );
}

