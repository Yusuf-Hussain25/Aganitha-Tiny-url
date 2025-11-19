import Link from "next/link";
import { LinkForm } from "@/components/dashboard/link-form";
import { LinksTable } from "@/components/dashboard/links-table";
import { listLinks } from "@/lib/links";

export const dynamic = "force-dynamic";

export default async function Home() {
  const links = await listLinks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/40 px-4 py-10 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            URL Dashboard
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
                Shorten links, share confidently.
              </h1>
              <p className="mt-2 text-base text-zinc-500">
                Create bite-sized URLs, view click trends, and manage everything
                in one place.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/healthz"
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-100"
              >
                Healthcheck
              </Link>
              <a
                href="https://neon.tech"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
              >
                Powered by Neon
              </a>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <LinksTable links={links} />
          <div className="flex flex-col gap-4">
            <LinkForm />
            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Need inspiration?
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Use custom codes for docs, release notes, campaigns.</li>
                <li>• Delete expired promos in one click.</li>
                <li>• Visit <code className="rounded bg-zinc-100 px-1 py-0.5">/code/:code</code> to dive into stats.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
