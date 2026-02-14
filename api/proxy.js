import axios from "axios";

function page(content) {
  return `
  <html>
  <head>
  <meta name="viewport" content="width=240">
  </head>
  <body style="background:black;color:white;font-family:Arial">
  ${content}
  </body>
  </html>`;
}

export default async function handler(req, res) {
  try {
    const { v } = req.query;

    if (!v) {
      return res.send(page(`
        <h3>S60 YouTube Lite</h3>
        <form>
        <input name="v" placeholder="Video ID">
        <input type="submit" value="Open">
        </form>
      `));
    }

    // لا نحاول استخراج mp4 (يسبب crash)
    // فقط نستخدم embed خفيف

    const embedUrl = `https://www.youtube.com/embed/${v}`;

    return res.send(page(`
      <a href="/">⬅ Back</a><br><br>
      <iframe width="240" height="200"
      src="${embedUrl}"
      frameborder="0"></iframe>
      <br><br>
      <a href="${embedUrl}">Open Direct</a>
    `));

  } catch (err) {
    return res.status(200).send(page("Engine safe mode"));
  }
}