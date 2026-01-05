import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const oembed = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(oembed, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "application/json,text/plain,*/*",
      },
      next: { revalidate: 60 * 60 },
    });

    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "oEmbed fetch failed",
          status: res.status,
          sample: raw.slice(0, 160),
        },
        { status: 400 }
      );
    }

    // 200 แต่ไม่ใช่ JSON (โดน anti-bot)
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          error: "TikTok returned non-JSON",
          contentType,
          sample: raw.slice(0, 160),
        },
        { status: 400 }
      );
    }

    const data = JSON.parse(raw);

    return NextResponse.json({
      title: data.title || "",
      authorName: data.author_name || "",
      thumbnailUrl: data.thumbnail_url || "",
      providerName: data.provider_name || "TikTok",
      html: data.html || "",
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Server error", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
