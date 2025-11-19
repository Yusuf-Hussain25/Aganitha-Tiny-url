import { NextResponse } from "next/server";
import { getLink, incrementClickCount } from "@/lib/links";

type Params = {
  params: {
    code: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  const link = await getLink(params.code);
  if (!link) {
    return NextResponse.json(
      { error: "Link not found" },
      { status: 404 },
    );
  }

  await incrementClickCount(params.code);

  return NextResponse.redirect(link.targetUrl, { status: 302 });
}

