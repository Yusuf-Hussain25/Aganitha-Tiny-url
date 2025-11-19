import { NextResponse } from "next/server";
import { z } from "zod";
import {
  DuplicateCodeError,
  InvalidCodeFormatError,
  InvalidUrlError,
  createLink,
  listLinks,
} from "@/lib/links";

const CreateLinkSchema = z.object({
  url: z.string().min(1, "Target URL is required"),
  code: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val?.length ? val : undefined)),
});

export async function GET() {
  const links = await listLinks();
  return NextResponse.json({ links });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = CreateLinkSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const link = await createLink({
      targetUrl: parsed.data.url,
      code: parsed.data.code,
    });
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    if (
      error instanceof DuplicateCodeError ||
      error instanceof InvalidCodeFormatError
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error instanceof DuplicateCodeError ? 409 : 400 },
      );
    }

    if (error instanceof InvalidUrlError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Failed to create link", error);
    return NextResponse.json(
      { error: "Unexpected error while creating link" },
      { status: 500 },
    );
  }
}

