export default function handler(req, res) {

  const { type, q, id } = req.query;
  const API_KEY = process.env.YT_KEY;

  // 🔎 البحث
  if (type === "search" && q) {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(q)}&key=${API_KEY}`)
      .then(r => r.json())
      .then(data => {
        const results = data.items.map(v => ({
          id: v.id.videoId,
          title: v.snippet.title,
          thumbnail: v.snippet.thumbnails.default.url
        }));
        res.json({ results });
      })
      .catch(() => res.status(500).json({ error: "Search failed" }));
    return;
  }

  // ▶ تشغيل
  if (type === "watch" && id) {
    return res.json({
      id,
      embed: `https://www.youtube.com/embed/${id}`
    });
  }

  // افتراضي
  res.json({
    status: "OK",
    usage: {
      search: "/api?type=search&q=iphone",
      watch: "/api?type=watch&id=VIDEO_ID"
    }
  });
}