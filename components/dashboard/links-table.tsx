"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LinkRecord } from "@/lib/links";

type Props = {
  links: LinkRecord[];
};

export function LinksTable({ links }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const filtered = useMemo(() => {
    if (!query.trim()) return links;
    return links.filter((link) => {
      const target = link.targetUrl.toLowerCase();
      const code = link.code.toLowerCase();
      const q = query.trim().toLowerCase();
      return target.includes(q) || code.includes(q);
    });
  }, [links, query]);

  async function handleDelete(code: string) {
    const confirmation = window.confirm(
      `Delete the short link for code "${code}"?`,
    );
    if (!confirmation) return;

    setIsDeleting(code);
    const response = await fetch(`/api/links/${code}`, { method: "DELETE" });
    setIsDeleting(null);

    if (response.ok) {
      router.refresh();
    } else {
      const data = await response.json().catch(() => null);
      alert(data?.error ?? "Unable to delete link. Try again.");
    }
  }

  async function handleCopy(code: string) {
    if (!origin) return;
    const url = `${origin}/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      alert("Unable to copy. Please copy manually.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Links ({filtered.length}/{links.length})
        </h2>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by code or URL"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-red-600 caret-red-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-red-400 dark:caret-red-400 md:w-72"
        />
      </div>

      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-300 bg-white/80 px-6 py-10 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            No links yet
          </p>
          <p className="text-sm text-zinc-500">
            Create your first short link to see it here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50/80 dark:bg-zinc-900/40">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">
                  Code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">
                  Target URL
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">
                  Total clicks
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">
                  Last clicked
                </th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950/40">
              {filtered.map((link) => (
                <tr key={link.code} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-mono text-sm text-zinc-900 dark:text-zinc-50">
                      {link.code}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(link.code)}
                      className="mt-1 text-xs text-blue-600 hover:underline"
                    >
                      {copiedCode === link.code ? "Copied!" : "Copy"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={link.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block max-w-xs truncate text-sm text-blue-600 hover:underline"
                    >
                      {link.targetUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {link.totalClicks}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-500">
                    {link.lastClickedAt
                      ? new Date(link.lastClickedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/code/${link.code}`}
                        className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:border-zinc-500 dark:border-zinc-600 dark:text-zinc-100"
                      >
                        Stats
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(link.code)}
                        disabled={isDeleting === link.code}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeleting === link.code ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-zinc-500">
              No links match “{query}”.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

