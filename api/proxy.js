if (v) {
  const watchUrl = `https://www.youtube.com/watch?v=${v}&bpctr=9999999999&has_verified=1`;

  const r = await axios.get(watchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5) AppleWebKit/537.36 Chrome/90 Mobile Safari/537.36"
    }
  });

  const html = r.data;

  const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/);

  if (!playerResponseMatch) {
    return res.send(miniPage("Player JSON not found"));
  }

  const playerJson = JSON.parse(playerResponseMatch[1]);

  const formats =
    playerJson?.streamingData?.formats ||
    playerJson?.streamingData?.adaptiveFormats;

  if (!formats || !formats.length) {
    return res.send(miniPage("No streaming formats found"));
  }

  // نختار أقل جودة
  const lowest = formats.sort((a, b) => (a.bitrate || 0) - (b.bitrate || 0))[0];

  if (!lowest.url) {
    return res.send(miniPage("Signature protected video"));
  }

  const videoUrl = lowest.url;

  const player = `
    <a href="/">⬅ Back</a><br><br>
    <video width="240" controls>
      <source src="${videoUrl}" type="video/mp4">
    </video>
    <br><br>
    <a href="${videoUrl}">Direct Link</a>
  `;

  return res.send(miniPage(player));
}