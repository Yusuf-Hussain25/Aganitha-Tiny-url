import { NextRequest, NextResponse } from "next/server";
import { getLink, incrementClickCount } from "@/lib/links";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const link = await getLink(code);
  if (!link) {
    return NextResponse.json(
      { error: "Link not found" },
      { status: 404 },
    );
  }

  await incrementClickCount(code);

  return NextResponse.redirect(link.targetUrl, { status: 302 });
}

