const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
  <meta charset="UTF-8">
  <title>S60Tube</title>
  <style>
    body{background:#000;color:#fff;font-family:Arial;font-size:14px}
    input{width:70%;padding:5px}
    button{padding:5px}
    .item{margin:8px 0;padding:6px;background:#111}
    a{color:#0af;text-decoration:none}
  </style>
  </head>
  <body>
    <form action="/search" method="get">
      <input name="q">
      <button type="submit">بحث</button>
    </form>
  </body>
  </html>
  `);
});


app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.send("لا يوجد بحث");

  try {
    const url = `https://s60tube.io.vn/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    let results = [];

    $("a").each((i, el) => {
      const href = $(el).attr("href");
      const title = $(el).text().trim();

      if (href && href.indexOf("/video/") !== -1) {
        const match = href.match(/\/video\/([A-Za-z0-9_-]+)/);
        if (match && title) {
          results.push({
            id: match[1],
            title: title
          });
        }
      }
    });

    // إزالة التكرار
    const unique = {};
    results.forEach(item => {
      unique[item.id] = item.title;
    });

    let html = `
    <html>
    <head>
    <meta charset="UTF-8">
    <title>النتائج</title>
    <style>
      body{background:#000;color:#fff;font-family:Arial;font-size:14px}
      .item{margin:8px 0;padding:6px;background:#111}
      a{color:#0af;text-decoration:none}
    </style>
    </head>
    <body>
    <a href="/">رجوع</a>
    <hr>
    `;

    for (let id in unique) {
      html += `
        <div class="item">
          <b>${unique[id]}</b><br>
          ID: ${id}<br>
          <a href="http://s60tube.io.vn/videoplayback?v=${id}">
            تشغيل
          </a>
        </div>
      `;
    }

    html += "</body></html>";

    res.send(html);

  } catch (err) {
    res.send("خطأ في جلب البيانات");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});