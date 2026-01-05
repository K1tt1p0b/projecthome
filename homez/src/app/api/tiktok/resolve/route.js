import { NextResponse } from "next/server";

function extractTikTokPostIdFromUrl(u) {
  try {
    const url = typeof u === "string" ? new URL(u) : u;
    const m = url.pathname.match(/\/video\/(\d+)/);
    return m?.[1] || null;
  } catch {
    return null;
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try {
    // ตาม redirect เพื่อให้ได้ finalUrl ที่มี /video/{id}
    // ใช้ GET แบบไม่อ่าน body (แต่ Node fetch จะตาม redirect ให้)
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      // กันค้าง
      cache: "no-store",
    });

    const finalUrl = res.url || url;

    // พยายามดึง postId จาก finalUrl ก่อน
    let postId = extractTikTokPostIdFromUrl(finalUrl);

    // ถ้ายังไม่เจอ ลองอ่าน HTML นิดหน่อยแล้วหาจาก pattern (เผื่อบางเคส)
    if (!postId) {
      const html = await res.text().catch(() => "");
      // เคสทั่วไป: .../video/123...
      const m1 = html.match(/\/video\/(\d{10,})/);
      if (m1?.[1]) postId = m1[1];

      // เคส embed มี itemId
      if (!postId) {
        const m2 = html.match(/"itemId"\s*:\s*"(\d{10,})"/);
        if (m2?.[1]) postId = m2[1];
      }
    }

    return NextResponse.json({
      finalUrl,
      postId, // อาจเป็น null ถ้าโดน anti-bot หนักมาก
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Resolve failed", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
