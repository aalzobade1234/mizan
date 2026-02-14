export default function handler(req, res) {
  const q = req.query.q;

  if (!q) return res.send("No search query");

  const url = "https://m.youtube.com/results?search_query=" 
              + encodeURIComponent(q);

  res.redirect(url);
}