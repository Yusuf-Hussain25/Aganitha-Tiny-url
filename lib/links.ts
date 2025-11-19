import type { QueryResultRow } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { getDb } from "./db";
import { CODE_REGEX } from "./validation";

export class DuplicateCodeError extends Error {
  constructor(code: string) {
    super(`Code "${code}" already exists`);
    this.name = "DuplicateCodeError";
  }
}

export class InvalidUrlError extends Error {
  constructor(url: string) {
    super(`URL "${url}" is invalid`);
    this.name = "InvalidUrlError";
  }
}

export class InvalidCodeFormatError extends Error {
  constructor(code: string) {
    super(`Code "${code}" must match ${CODE_REGEX}`);
    this.name = "InvalidCodeFormatError";
  }
}

export type LinkRecord = {
  code: string;
  targetUrl: string;
  totalClicks: number;
  createdAt: string;
  lastClickedAt: string | null;
};

type LinkRow = QueryResultRow & {
  code: string;
  target_url: string;
  click_count: number;
  created_at: string;
  last_clicked_at: string | null;
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function normalizeUrl(rawUrl: string): string {
  let value = rawUrl.trim();
  if (!value) {
    throw new InvalidUrlError(rawUrl);
  }

  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new InvalidUrlError(rawUrl);
  }

  if (!(parsed.protocol === "http:" || parsed.protocol === "https:")) {
    throw new InvalidUrlError(rawUrl);
  }

  return parsed.toString();
}

export async function listLinks(): Promise<LinkRecord[]> {
  const db = await getDb();
  const rows = (await db`
    SELECT code, target_url, click_count, created_at, last_clicked_at
    FROM links
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
  `) as LinkRow[];

  return rows.map(mapRow);
}

export async function getLink(code: string): Promise<LinkRecord | null> {
  const db = await getDb();
  const rows = (await db`
    SELECT code, target_url, click_count, created_at, last_clicked_at
    FROM links
    WHERE code = ${code} AND deleted_at IS NULL
    LIMIT 1
  `) as LinkRow[];
  const row = rows.at(0);
  return row ? mapRow(row) : null;
}

export async function createLink(input: {
  targetUrl: string;
  code?: string;
}): Promise<LinkRecord> {
  const sanitizedUrl = normalizeUrl(input.targetUrl);
  const desiredCode = input.code?.trim();
  const code = desiredCode?.length
    ? validateCode(desiredCode)
    : await generateUniqueCode();

  const db = await getDb();

  try {
    const rows = (await db`
      INSERT INTO links (code, target_url)
      VALUES (${code}, ${sanitizedUrl})
      RETURNING code, target_url, click_count, created_at, last_clicked_at
    `) as LinkRow[];
    return mapRow(rows[0]);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DuplicateCodeError(code);
    }
    throw error;
  }
}

export async function deleteLink(code: string): Promise<boolean> {
  const db = await getDb();
  const rows = (await db`
    DELETE FROM links
    WHERE code = ${code}
    RETURNING code
  `) as { code: string }[];

  return rows.length > 0;
}

export async function incrementClickCount(code: string): Promise<void> {
  const db = await getDb();
  await db`
    UPDATE links
    SET click_count = click_count + 1,
        last_clicked_at = NOW()
    WHERE code = ${code}
      AND deleted_at IS NULL
  `;
}

function validateCode(code: string): string {
  if (!CODE_REGEX.test(code)) {
    throw new InvalidCodeFormatError(code);
  }
  return code;
}

async function generateUniqueCode(): Promise<string> {
  for (let i = 0; i < 5; i += 1) {
    const candidate = randomCode(6);
    const existing = await getLink(candidate);
    if (!existing) {
      return candidate;
    }
  }

  return randomCode(8);
}

function randomCode(size: number): string {
  let result = "";
  const bytes = randomBytes(size);
  for (let i = 0; i < size; i += 1) {
    result += LETTERS[bytes[i] % LETTERS.length];
  }
  return result;
}

function isUniqueViolation(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function mapRow(row: LinkRow): LinkRecord {
  return {
    code: row.code,
    targetUrl: row.target_url,
    totalClicks: Number(row.click_count ?? 0),
    createdAt: row.created_at,
    lastClickedAt: row.last_clicked_at,
  };
}

