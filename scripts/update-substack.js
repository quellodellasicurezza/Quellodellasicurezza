const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

const FEED =
  "https://quellodellasicurezza.substack.com/feed";

async function update() {

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
}

update();
