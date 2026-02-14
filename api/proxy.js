import axios from "axios";

export default async function handler(req, res) {
  try {
    const { url, ua } = req.query;
    if (!url) return res.status(400).send("Missing url");

    const isGoogle = url.includes("google.");

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      responseType: "stream",
      headers: {
        ...req.headers,
        host: new URL(url).host,
        "User-Agent":
          ua ||
          "Mozilla/5.0 (Linux; Android 12; Mini S60 Touch) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36"
      },
      maxRedirects: 5,
      validateStatus: () => true
    });

    res.setHeader("Access-Control-Allow-Origin", "*");

    // لو Google لا نعدل المحتوى
    if (isGoogle) {
      res.status(response.status);
      return response.data.pipe(res);
    }

    // لباقي المواقع (تبسيط خفيف فقط)
    let data = "";
    response.data.on("data", chunk => {
      data += chunk.toString();
    });

    response.data.on("end", () => {
      data = data
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
        .replace(/<img[^>]*>/gi, "");

      res.status(200).send(data);
    });

  } catch (err) {
    res.status(500).send("Proxy Error");
  }
}