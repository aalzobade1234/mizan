import axios from "axios";

function page(content) {
  return `
  <html>
  <head>
    <meta name="viewport" content="width=240">
    <style>
      body{background:black;color:white;font-family:Arial;font-size:14px}
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

    // 🎬 تشغيل فيديو
    if (v) {
      const embedUrl = `https://www.youtube.com/embed/${v}`;

      return res.send(page(`
        <a href="/">⬅ Back</a><br><br>
        <b>Video ID:</b> ${v}<br><br>
        <iframe width="240" height="200"
          src="${embedUrl}"
          frameborder="0"></iframe>
        <br><br>
        <a href="?v=${v}">Reload</a>
      `));
    }

    // 🔎 البحث
    if (q) {
      const searchUrl = `https://m.youtube.com/results?search_query=${encodeURIComponent(q)}`;

      const r = await axios.get(searchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5) AppleWebKit/537.36 Chrome/90 Mobile Safari/537.36"
        },
        timeout: 10000
      });

      const html = r.data;

      // استخراج videoId بطريقة خفيفة جدًا
      const ids = [...new Set(
        (html.match(/"videoId":"(.*?)"/g) || [])
          .map(x => x.replace(/"|videoId|:/g, ""))
      )];

      if (!ids.length) {
        return res.send(page("No results found"));
      }

      let list = `
        <form>
          <input name="q" placeholder="Search">
          <input type="submit" value="Go">
        </form><hr>
      `;

      ids.slice(0, 15).forEach(id => {
        list += `<div>
          <a href="?v=${id}">${id}</a>
        </div><br>`;
      });

      return res.send(page(list));
    }

    // 🏠 الصفحة الرئيسية
    return res.send(page(`
      <h3>S60 YouTube Lite</h3>
      <form>
        <input name="q" placeholder="Search YouTube">
        <input type="submit" value="Search">
      </form>
    `));

  } catch (err) {
    return res.status(200).send(page("Safe Mode"));
  }
}