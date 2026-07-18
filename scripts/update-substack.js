const fs = require("fs");
const https = require("https");
const Parser = require("rss-parser");

const FEED = "https://quellodellasicurezza.substack.com/feed";

function getFeed(url) {
  return new Promise((resolve, reject) => {

    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/rss+xml, application/xml, text/xml"
      }
    };

    https.get(url, options, (res) => {

      let data = "";

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {

        if (res.statusCode !== 200) {
          reject(
            new Error("HTTP " + res.statusCode)
          );
        } else {
          resolve(data);
        }

      });

    }).on("error", reject);

  });
}


async function update() {

  try {

    const xml = await getFeed(FEED);

    const parser = new Parser();

    const feed = await parser.parseString(xml);

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

    console.log("Aggiornamento completato");

  } catch (err) {

    console.error(
      "Errore:",
      err.message
    );

    process.exit(1);

  }

}

update();
