import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const isYouTube =
    /youtube\.com|youtu\.be/i.test(url);

  if (!isYouTube) {
    return NextResponse.json(
      { error: "Only YouTube is supported (for now)" },
      { status: 400 }
    );
  }

  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    url
  )}&format=json`;

  try {
    const res = await fetch(oembed, { next: { revalidate: 60 * 60 } });
    if (!res.ok) {
      return NextResponse.json({ error: "oEmbed fetch failed" }, { status: 400 });
    }

    const data = await res.json();
    return NextResponse.json({
      title: data.title,
      authorName: data.author_name,
      thumbnailUrl: data.thumbnail_url,
      providerName: data.provider_name,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
