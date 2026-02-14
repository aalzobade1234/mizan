import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "AIzaSyA13g5wscZCwXCge9KTH9-47nlc3hwg808";

/* =========================
   SEARCH
========================= */

app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.send("No query");

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          type: "video",
          maxResults: 8,
          q: q,
          key: API_KEY
        }
      }
    );

    let html = `
      <html>
      <body style="background:black;color:white;font-family:sans-serif">
      <h3>Results</h3>
    `;

    response.data.items.forEach(item => {
      const id = item.id.videoId;
      const title = item.snippet.title;

      html += `
        <div style="margin-bottom:12px">
          <a style="color:cyan"
             href="/play?id=${id}">
             ${title}
          </a>
        </div>
      `;
    });

    html += "</body></html>";

    res.send(html);

  } catch {
    res.send("Error");
  }
});

/* =========================
   PLAY USING EMBED
========================= */

app.get("/play", (req, res) => {
  const id = req.query.id;
  if (!id) return res.send("No video");

  res.send(`
    <html>
    <body style="background:black;text-align:center;margin:0">

      <iframe
        width="100%"
        height="220"
        src="https://www.youtube.com/embed/${id}?rel=0&autoplay=1"
        frameborder="0"
        allowfullscreen>
      </iframe>

      <br><br>

      <a style="color:cyan"
         href="https://www.youtube.com/watch?v=${id}">
         Open in External Player
      </a>

    </body>
    </html>
  `);
});

/* ========================= */

app.listen(PORT, () => {
  console.log("YouTube Embed Proxy Running");
});