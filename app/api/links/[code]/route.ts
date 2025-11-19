import { NextResponse } from "next/server";
import { deleteLink, getLink } from "@/lib/links";

type Params = {
  params: {
    code: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  const link = await getLink(params.code);
  if (!link) {
    return NextResponse.json(
      { error: `No link found for code "${params.code}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(link);
}

export async function DELETE(_: Request, { params }: Params) {
  const removed = await deleteLink(params.code);
  if (!removed) {
    return NextResponse.json(
      { error: `No link found for code "${params.code}"` },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}

