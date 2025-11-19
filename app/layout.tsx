import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiny URL Dashboard",
  description: "Shorten, track, and manage links with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased dark:bg-black`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-zinc-100 bg-white/90 px-6 py-4 text-sm text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
              <Link
                href="/"
                className="text-base font-semibold text-zinc-900 transition hover:text-blue-600 dark:text-zinc-100"
              >
                tinyurl.app
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/"
                  className="transition hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/healthz"
                  className="transition hover:text-blue-600"
                >
                  Health
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-blue-600"
                >
                  Repo
                </a>
              </nav>
            </div>
          </header>
          <div className="flex-1">{children}</div>
          <footer className="border-t border-zinc-100 bg-white/90 px-6 py-6 text-sm text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>Built with Next.js + Neon</p>
              <p className="text-xs text-zinc-400">
                Uptime: check <code>/healthz</code>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
