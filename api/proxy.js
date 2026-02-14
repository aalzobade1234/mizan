import axios from "axios";

function miniPage(content) {
  return `
  <html>
  <head>
    <meta name="viewport" content="width=240, initial-scale=1">
    <style>
      body{background:#000;color:#fff;font-family:Arial;font-size:14px}
      a{color:yellow;text-decoration:none}
      input{width:180px}
    </style>
  </head>
  <body>${content}</body>
  </html>`;
}

export default async function handler(req, res) {
  try {
    const { q, v } = req.query;

    // 🔎 وضع البحث
    if (q) {
      const searchUrl = `https://m.youtube.com/results?search_query=${encodeURIComponent(q)}`;

      const r = await axios.get(searchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 4.4; Nexus One) AppleWebKit/537.36 Chrome/30 Mobile Safari/537.36"
        },
        timeout: 15000
      });

      const html = r.data;

      const videos = [...html.matchAll(/"videoId":"(.*?)".*?"title":{"runs":\[{"text":"(.*?)"/g)];

      if (!videos.length) {
        return res.send(miniPage("No results"));
      }

      let list = `<form>
        <input name="q" placeholder="Search">
        <input type="submit" value="Go">
      </form><hr>`;

      videos.slice(0, 10).forEach(v => {
        list += `<div>
          <a href="?v=${v[1]}">${v[2]}</a>
        </div><br>`;
      });

      return res.send(miniPage(list));
    }

    // ▶ وضع تشغيل فيديو
    if (v) {
      const watchUrl = `https://m.youtube.com/watch?v=${v}`;

      const r = await axios.get(watchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 4.4; Nexus One) AppleWebKit/537.36 Chrome/30 Mobile Safari/537.36"
        }
      });

      const html = r.data;

      const match = html.match(/https:\/\/[^"]+\.googlevideo\.com[^"]+/);

      if (!match) {
        return res.send(miniPage("Stream not found"));
      }

      const videoUrl = match[0];

      const player = `
        <a href="/">⬅ Back</a><br><br>
        <video width="240" controls>
          <source src="${videoUrl}" type="video/mp4">
        </video>
        <br><br>
        <a href="${videoUrl}">Direct Link</a>
      `;

      return res.send(miniPage(player));
    }

    // 🏠 الصفحة الرئيسية
    const home = `
      <h3>S60 YouTube Lite</h3>
      <form>
        <input name="q" placeholder="Search YouTube">
        <input type="submit" value="Search">
      </form>
    `;

    res.setHeader("Content-Type", "text/html");
    return res.send(miniPage(home));

  } catch (err) {
    return res.status(500).send("Engine Error");
  }
}