// 🔎 البحث بدون API
if (q) {

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

  const r = await axios.get(searchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5) AppleWebKit/537.36 Chrome/90 Mobile Safari/537.36"
    },
    timeout: 10000
  });

  const html = r.data;

  // استخراج ytInitialData بطريقة آمنة
  const match = html.match(/ytInitialData\s*=\s*(\{.*?\});/s);

  if (!match) {
    return res.send(page("Search failed"));
  }

  let json;
  try {
    json = JSON.parse(match[1]);
  } catch {
    return res.send(page("Parse error"));
  }

  const sections =
    json?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

  let list = `
    <form>
      <input name="q" placeholder="Search">
      <input type="submit" value="Go">
    </form><hr>
  `;

  let count = 0;

  sections.forEach(section => {
    const items = section.itemSectionRenderer?.contents || [];
    items.forEach(item => {
      const videoId = item.videoRenderer?.videoId;
      const title = item.videoRenderer?.title?.runs?.[0]?.text;

      if (videoId && count < 10) {
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