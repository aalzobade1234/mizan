import axios from "axios";
import zlib from "zlib";

export default async function handler(req, res) {
  const { url, ua } = req.query;
  if (!url) return res.status(400).send("Missing url");

  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "arraybuffer",
      headers: {
        "User-Agent": ua || 
        "Mozilla/5.0 (Linux; Android 12; Mini S60 Touch) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
        "Accept-Encoding": "gzip, deflate"
      },
      timeout: 15000
    });

    let html = response.data.toString("utf-8");

    // إزالة سكربتات
    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

    // إزالة CSS خارجي
    html = html.replace(/<link[^>]*stylesheet[^>]*>/gi, "");

    // إزالة صور كبيرة
    html = html.replace(/<img[^>]*>/gi, "");

    // إزالة iframe
    html = html.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");

    // تبسيط المسافات
    html = html.replace(/\s+/g, " ");

    // ضغط gzip
    const compressed = zlib.gzipSync(html);

    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(compressed);

  } catch (err) {
    res.status(500).send("Fetch failed");
  }
}