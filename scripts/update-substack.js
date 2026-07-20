const fs = require("fs");
const https = require("https");

const FEED =
"https://api.rss2json.com/v1/api.json?rss_url=https://quellodellasicurezza.substack.com/feed";


function getJSON(url) {

return new Promise((resolve,reject)=>{

https.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
},
res=>{

let data="";

res.on("data",chunk=>{
data+=chunk;
});

res.on("end",()=>{

try{
resolve(JSON.parse(data));
}
catch(e){
reject(e);
}

});

}).on("error",reject);

});

}



function clean(text){

return (text || "")
.replace(/<[^>]*>/g,"")
.replace(/&nbsp;/g," ")
.replace(/&amp;/g,"&")
.trim();

}



function card(post){

const title=post.title || "";
const link=post.link || "";

const date=new Date(post.pubDate)
.toLocaleDateString("it-IT");


const excerpt=clean(
post.description || post.content
)
.substring(0,220)+"...";


const image=post.thumbnail
? `<img src="${post.thumbnail}"
style="
width:100%;
border-radius:10px;
margin-bottom:15px;
">`
:"";


return `

<article class="newsletter-card">

${image}

<div class="widget-title">
Analisi
</div>


<h3>
<a href="${link}" target="_blank">
${title}
</a>
</h3>


<p>
${excerpt}
</p>


<div class="date">
${date}
</div>


<a class="read"
href="${link}"
target="_blank">
Leggi →
</a>


</article>

`;

}



async function update(){

try{


const data=await getJSON(FEED);

const posts=data.items;


const latest=posts[0];


// ULTIMA NEWSLETTER

fs.writeFileSync(
"latest-newsletter.html",

card(latest)

);



// ARCHIVIO

const archive=posts
.slice(0,5)
.map(card)
.join("");


fs.writeFileSync(
"archive-newsletter.html",

`
<div class="widget-title">
Ultime analisi
</div>

${archive}
`

);



console.log(
"Aggiornamento completato"
);



}

catch(err){

console.error(err);

process.exit(1);

}

}


update();
