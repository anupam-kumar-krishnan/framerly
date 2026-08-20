import { NextRequest, NextResponse } from "next/server";

const SNAPRENDER_ENDPOINT = "https://app.snap-render.com/v1/screenshot";

export async function GET(req: NextRequest) {
  console.log("Key loaded:", !!process.env.SNAPRENDER_API_KEY);

  const targetUrl = req.nextUrl.searchParams.get("url");
  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const apiKey = process.env.SNAPRENDER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfigured: missing SNAPRENDER_API_KEY" },
      { status: 500 },
    );
  }

  const normalized = /^https?:\/\//i.test(targetUrl)
    ? targetUrl
    : `https://${targetUrl}`;

  const darkModeParam = req.nextUrl.searchParams.get("dark_mode") ?? "true";

  const params = new URLSearchParams({
    url: normalized,
    format: "png", // lossless, no compression artifacts
    full_page: "false", // set "true" to capture full scroll height
    dark_mode: darkModeParam === "true" ? "true" : "false",
    block_ads: "true",
  });

  try {
    const res = await fetch(`${SNAPRENDER_ENDPOINT}?${params.toString()}`, {
      headers: { "X-API-Key": apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("SnapRender error:", res.status, body);
      return NextResponse.json(
        { error: "Screenshot capture failed" },
        { status: res.status === 429 ? 429 : 502 },
      );
    }

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    // X-Cache header tells you if this hit their cache (free) or was a fresh render
    const cacheStatus = res.headers.get("X-Cache") ?? "unknown";

    return NextResponse.json({ image: dataUrl, cache: cacheStatus });
  } catch (err) {
    console.error("Screenshot fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 500 },
    );
  }
}
