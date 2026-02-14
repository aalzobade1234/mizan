import axios from "axios";

export default async function handler(req, res) {
  try {
    const { url, ua } = req.query;
    if (!url) return res.status(400).send("Missing url");

    const response = await axios({
      method: "GET",
      url,
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          ua ||
          "Mozilla/5.0 (Linux; Android 12; Mini S60 Touch) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
        "Accept": "*/*"
      },
      maxRedirects: 5,
      timeout: 15000,
      validateStatus: () => true
    });

    const contentType = response.headers["content-type"] || "text/html";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(response.status).send(response.data);

  } catch (error) {
    return res.status(500).json({
      error: "Proxy Failed",
      message: error.message
    });
  }
}