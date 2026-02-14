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

    // ▶ تشغيل فيديو
    if (v) {
      const embedUrl = `https://www.youtube.com/embed/${v}`;
      return res.send(page(`
        <a href="/">⬅ Back</a><br><br>
        <b>Video ID:</b> ${v}<br><br>
        <iframe width="240" height="200"
          src="${embedUrl}"
          frameborder="0"></iframe>
      `));
    }

    // 🔎 بحث عبر Innertube API
    if (q) {

      const response = await axios.post(
        "https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
        {
          query: q,
          context: {
            client: {
              clientName: "ANDROID",
              clientVersion: "16.20"
            }
          }
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      const items =
        response.data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

      let list = `
        <form>
          <input name="q" placeholder="Search">
          <input type="submit" value="Go">
        </form><hr>
      `;

      let count = 0;

      items.forEach(section => {
        const videos = section.itemSectionRenderer?.contents || [];
        videos.forEach(item => {
          const videoId = item.videoRenderer?.videoId;
          const title =
            item.videoRenderer?.title?.runs?.[0]?.text;

          if (videoId && count < 15) {
            list += `<div>
              <a href="?v=${videoId}">${title}</a>
            </div><br>`;
            count++;
          }
        });
      });

      if (count === 0) {
        return res.send(page("No results found"));
      }

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