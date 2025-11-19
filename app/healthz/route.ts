import { NextResponse } from "next/server";

const startedAt = Date.now();

export async function GET() {
  const uptimeSeconds = Math.round(process.uptime());

  return NextResponse.json({
    ok: true,
    version: "1.0",
    uptimeSeconds,
    startedAt,
    timestamp: Date.now(),
  });
}

