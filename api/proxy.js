import axios from "axios";

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("Missing url");

    // تحويل روابط youtube العادية إلى نسخة m
    let target = url
      .replace("youtube.com", "m.youtube.com")
      .replace("youtu.be/", "www.youtube.com/watch?v=");

    const response = await axios({
      method: "GET",
      url: target,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 4.4; Nexus One) AppleWebKit/537.36 Chrome/30 Mobile Safari/537.36"
      },
      timeout: 15000
    });

    let html = response.data;

    // استخراج رابط mp4 مباشر
    const match = html.match(/https:\/\/[^"]+\.googlevideo\.com[^"]+/);

    if (!match) {
      return res.send("Video stream not found");
    }

    const videoUrl = match[0];

    // صفحة بسيطة جدًا
    const simplePage = `
      <html>
      <head>
      <meta name="viewport" content="width=240">
      </head>
      <body style="background:black;color:white;text-align:center;">
        <h3>Video Ready</h3>
        <video width="240" controls>
          <source src="${videoUrl}" type="video/mp4">
        </video>
        <br><br>
        <a href="${videoUrl}" style="color:yellow;">Direct Link</a>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    return res.send(simplePage);

  } catch (err) {
    return res.status(500).send("S60 YouTube Mode Error");
  }
}