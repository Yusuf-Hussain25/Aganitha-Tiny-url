"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CODE_REGEX, looksLikeUrl } from "@/lib/validation";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const defaultStatus: Status = { kind: "idle" };

export function LinkForm() {
  const router = useRouter();
  const [form, setForm] = useState({ url: "", code: "" });
  const [touched, setTouched] = useState({ url: false, code: false });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [isPending, startTransition] = useTransition();

  const urlError =
    form.url.trim().length === 0
      ? "Enter a valid URL"
      : !looksLikeUrl(form.url)
        ? "URL should start with http(s) or domain"
        : null;

  const codeError =
    form.code.trim().length === 0
      ? null
      : CODE_REGEX.test(form.code.trim())
        ? null
        : "Codes must be 6-8 letters/numbers";

  const isDisabled =
    urlError !== null ||
    codeError !== null ||
    status.kind === "submitting" ||
    isPending;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    if (isDisabled) {
      return;
    }

    setStatus({ kind: "submitting" });

    const response = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: form.url.trim(),
        code: form.code.trim() || undefined,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus({
        kind: "error",
        message:
          data?.error ??
          "Something went wrong. Please verify the details and try again.",
      });
      return;
    }

    setForm({ url: "", code: "" });
    setTouched({ url: false, code: false });
    setHasSubmitted(false);
    setStatus({
      kind: "success",
      message: "Short link created successfully.",
    });
    startTransition(() => router.refresh());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60"
    >
      <div>
        <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Destination URL
        </label>
        <input
          type="text"
          value={form.url}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, url: event.target.value }))
          }
          onBlur={() => setTouched((prev) => ({ ...prev, url: true }))}
          placeholder="https://example.com/docs"
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-red-600 caret-red-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-red-400 dark:caret-red-400"
        />
        {urlError && (touched.url || hasSubmitted) && (
          <p className="mt-2 text-sm text-red-600">{urlError}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Custom code <span className="text-xs font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          type="text"
          value={form.code}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, code: event.target.value }))
          }
          onBlur={() => setTouched((prev) => ({ ...prev, code: true }))}
          placeholder="docs"
          maxLength={8}
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm tracking-wide text-zinc-900 caret-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:caret-white"
        />
        {codeError && (touched.code || hasSubmitted) && (
          <p className="mt-2 text-sm text-red-600">{codeError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {status.kind === "submitting" ? "Creating..." : "Create short link"}
      </button>

      {status.kind === "error" && (
        <p className="text-sm text-red-600">{status.message}</p>
      )}
      {status.kind === "success" && (
        <p className="text-sm text-green-600">{status.message}</p>
      )}
    </form>
  );
}


