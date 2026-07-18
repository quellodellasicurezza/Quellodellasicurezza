const fs = require("fs");
const https = require("https");

const FEED =
  "https://api.rss2json.com/v1/api.json?rss_url=https://quellodellasicurezza.substack.com/feed";


function getJSON(url) {

  return new Promise((resolve, reject) => {

    https.get(url, {

      headers: {
        "User-Agent": "Mozilla/5.0"
      }

    }, res => {

      let data = "";

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {

        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(e);
        }

      });

    }).on("error", reject);

  });

}


async function update() {

  try {

    const data = await getJSON(FEED);

    const post = data.items[0];

    const html = `

<div class="widget-title">
Ultima analisi
</div>

<a href="${post.link}" target="_blank">

<strong>
${post.title}
</strong>

<br><br>

<span style="color:#aaa;font-size:13px">
${new Date(post.pubDate)
.toLocaleDateString("it-IT")}
</span>

</a>

`;

    fs.writeFileSync(
      "latest-newsletter.html",
      html
    );

    console.log("Widget aggiornato");

  } catch(err) {

    console.error(err);
    process.exit(1);

  }

}


update();
