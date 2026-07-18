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
        }

        catch(e) {
          reject(e);
        }

      });

    }).on("error", reject);

  });

}



function cleanText(html) {

  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();

}



async function update() {


try {


const data = await getJSON(FEED);

const post = data.items[0];


const title = post.title || "";

const link = post.link || "";

const date = new Date(post.pubDate)
.toLocaleDateString("it-IT");


const excerpt = cleanText(
  post.description || post.content || ""
)
.substring(0,220)
+ "...";


let image = "";

if(post.thumbnail){

image = `
<img src="${post.thumbnail}"
style="
width:100%;
border-radius:10px;
margin-bottom:15px;
">
`;

}



const html = `

${image}

<div class="widget-title">
Ultima analisi
</div>


<strong>
${title}
</strong>


<p style="
color:#aaa;
font-size:14px;
line-height:1.5;
">

${excerpt}

</p>


<div style="
font-size:12px;
color:#777;
margin-bottom:12px;
">

Pubblicata il ${date}

</div>


<a href="${link}"
target="_blank"
style="
display:inline-block;
padding:10px 14px;
border-radius:8px;
background:#1b1b1b;
border:1px solid #333;
">

Leggi l'analisi completa →

</a>

`;



fs.writeFileSync(
"latest-newsletter.html",
html
);


console.log(
"Anteprima aggiornata"
);



}

catch(err){

console.error(err);

process.exit(1);

}


}


update();
