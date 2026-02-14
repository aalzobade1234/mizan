import fetch from "node-fetch";
import cheerio from "cheerio";
import { URL } from "url";

export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(200).send("S60 Lite Proxy<br>Use: ?url=http://example.com");
  }

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Opera/9.80 (J2ME/MIDP; Opera Mini/7.1)"
      }
    });

    let html = await response.text();
    const $ = cheerio.load(html);

    // حذف العناصر الثقيلة
    $("script").remove();
    $("style").remove();
    $("link[rel='stylesheet']").remove();
    $("iframe, video, source").remove();

    // تنظيف خصائص ثقيلة
    $("*").each(function () {
      $(this).removeAttr("style");
      $(this).removeAttr("class");
      $(this).removeAttr("id");
    });

    // تصغير الصور فقط (لا نحذفها)
    $("img").each(function () {
      $(this).attr("width", "240");
      $(this).removeAttr("height");
    });

    // تعديل الروابط
    $("a").each(function () {
      const link = $(this).attr("href");
      if (!link) return;

      const absolute = new URL(link, target).href;
      $(this).attr("href", `/api/proxy?url=${encodeURIComponent(absolute)}`);
    });

    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.status(200).send($.html());

  } catch (err) {
    res.status(500).send("Error loading site");
  }
}