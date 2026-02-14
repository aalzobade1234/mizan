import axios from "axios";
import zlib from "zlib";

export default async function handler(req, res) {
  try {
    const { url, ua } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const response = await axios({
      method: "GET",
      url,
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          ua ||
          "Mozilla/5.0 (Linux; Android 12; Mini S60 Touch) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
        "Accept": "text/html",
        "Accept-Encoding": "identity"
      },
      maxRedirects: 5,
      timeout: 15000,
      validateStatus: () => true
    });

    const contentType = response.headers["content-type"] || "";

    // لو ليس HTML نعيده كما هو
    if (!contentType.includes("text/html")) {
      res.setHeader("Content-Type", contentType);
      return res.send(response.data);
    }

    let html = response.data.toString("utf-8");

    // تنظيف آمن
    html = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
      .replace(/<img[^>]*>/gi, "")
      .replace(/<link[^>]*stylesheet[^>]*>/gi, "")
      .replace(/\s{2,}/g, " ");

    // إضافة viewport صغير
    html = html.replace(
      /<head>/i,
      `<head><meta name="viewport" content="width=240, initial-scale=1">`
    );

    // ضغط آمن
    const compressed = zlib.gzipSync(html);

    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).send(compressed);

  } catch (error) {
    return res.status(500).json({
      error: "Proxy Error",
      message: error.message
    });
  }
}