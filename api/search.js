export default function handler(req, res) {
  const q = req.query.q;

  if (!q) {
    res.send("No search query");
    return;
  }

  const searchUrl = "https://m.youtube.com/results?search_query=" 
                    + encodeURIComponent(q);

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <title>Results</title>
  </head>
  <body>
  <h3>Search Results</h3>
  <p>Your search: ${q}</p>
  <p>
  <a href="${searchUrl}">
  Open Results in Mobile YouTube
  </a>
  </p>
  <br>
  <a href="/">Back</a>
  </body>
  </html>
  `);
}