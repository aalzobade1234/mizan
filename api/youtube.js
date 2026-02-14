export default async function handler(req, res) {
  const { type, q, id } = req.query;
  const API_KEY = process.env.YT_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {

    // 🔎 البحث
    if (type === "search" && q) {
      const r = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(q)}&key=${API_KEY}`
      );

      const data = await r.json();

      if (!data.items) {
        return res.json({ results: [] });
      }

      const results = data.items.map(v => ({
        id: v.id.videoId,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails.default.url
      }));

      return res.json({ results });
    }

    // ▶ تشغيل
    if (type === "watch" && id) {
      return res.json({
        id,
        embed: `https://www.youtube.com/embed/${id}`
      });
    }

    return res.json({
      status: "OK",
      usage: {
        search: "/api/youtube?type=search&q=test",
        watch: "/api/youtube?type=watch&id=VIDEO_ID"
      }
    });

  } catch (e) {
    return res.status(500).json({ error: "Server crash" });
  }
}