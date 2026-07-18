const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  }
});

const FEED =
  "https://quellodellasicurezza.substack.com/feed";

async function update() {

  try {

    const feed = await parser.parseURL(FEED);

    const post = feed.items[0];

    const title = post.title || "";
    const link = post.link || "";
    const date = new Date(post.pubDate)
      .toLocaleDateString("it-IT");

    const html = `
<div class="widget-title">
Ultima analisi
</div>

<a href="${link}" target="_blank">
<strong>${title}</strong>
<br><br>
<span style="color:#aaa;font-size:13px">
Pubblicata il ${date}
</span>
</a>
`;

    fs.writeFileSync(
      "latest-newsletter.html",
      html
    );

    console.log("Widget aggiornato");

  } catch (error) {

    console.error(
      "Errore lettura Substack:",
      error
    );

    process.exit(1);
  }
}

update();
