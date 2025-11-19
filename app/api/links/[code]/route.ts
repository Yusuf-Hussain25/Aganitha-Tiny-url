import { NextRequest, NextResponse } from "next/server";
import { deleteLink, getLink } from "@/lib/links";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const link = await getLink(code);
  if (!link) {
    return NextResponse.json(
      { error: `No link found for code "${code}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(link);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const removed = await deleteLink(code);
  if (!removed) {
    return NextResponse.json(
      { error: `No link found for code "${code}"` },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}

