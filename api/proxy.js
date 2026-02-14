import axios from "axios";

export default async function handler(req, res) {
  const { url, ua } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
      headers: {
        "User-Agent": ua || 
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "*/*",
        "Referer": url,
        "Origin": new URL(url).origin
      },
      maxRedirects: 5,
      timeout: 15000
    });

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");

    // تمرير نوع المحتوى
    res.setHeader("Content-Type", response.headers["content-type"] || "text/html");

    // بث مباشر
    response.data.pipe(res);

  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
}