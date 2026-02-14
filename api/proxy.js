import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.YT_KEY; // ضع المفتاح في متغير بيئة

/* =========================
   🔎 SEARCH PROXY
========================= */

app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const url =
      "https://www.googleapis.com/youtube/v3/search";

    const response = await axios.get(url, {
      params: {
        part: "snippet",
        type: "video",
        maxResults: 10,
        q,
        key: API_KEY
      }
    });

    const results = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumb: item.snippet.thumbnails.default.url
    }));

    res.json(results);
  } catch (err) {
    res.json([]);
  }
});

/* =========================
   ▶ EXTRACT ID + EMBED
========================= */

app.get("/watch", (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("No URL");

  const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (!match) return res.send("Invalid link");

  const id = match[1];

  res.send(`
    <html>
    <body style="background:black;color:white;text-align:center">
      <h3>Playing</h3>

      <iframe width="320" height="200"
        src="https://www.youtube.com/embed/${id}"
        frameborder="0" allowfullscreen>
      </iframe>

      <br><br>

      <a href="https://www.youtube.com/watch?v=${id}">
        Open in External Player
      </a>

    </body>
    </html>
  `);
});

/* ========================= */

app.listen(PORT, () => {
  console.log("YouTube Proxy Running");
});