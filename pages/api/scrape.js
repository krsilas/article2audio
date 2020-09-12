// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const puppeteer = require('puppeteer');
const basePath = process.cwd();

async function scrapeHTML(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  //Block 3rd-Party-JavaScript
  page.on("request", request => {
    const baseUrl = (url) => url.split('/')[2]
    if (request.resourceType() === "script" && baseUrl(request._url) !== baseUrl(url)) {
      request.abort()
    } else {
      request.continue()
    }
  })
  
  // const cookies = [{
  //   'name': 'euconsent',
  //   'value': 'BO0G9R8O0G9R8AGABBENDL-AAAAv0DIIRAgYwoAg4PCFkgATAGCAiAgAwAQAAQAAQAYAAgBhCAAggAEACQgAAAQAAABABAIAAAAQEAgAgACAAJAAIAACAAEAABBAAIgAAAAAAAAAAAQAAAAAAAEAAAAAAAAAAA'
  // }, {
  //   'name': 'spconsent',
  //   'value': 'eyJ2YWx1ZSI6dHJ1ZSwidXBkYXRlZF9hdCI6MTU5MDY2MjgzOH0='
  // }];
  // await page.setCookie(...cookies)

  await page.goto(url);
  await page.evaluate(() => {
    const ignore = ["[data-app-hidden]", "article section.clear-both ul", ".hidden", "figcaption", "footer"]
    ignore.forEach((element)=>{
      const nodes = document.querySelectorAll(element)
      nodes.forEach((div)=>{
        div.parentNode.removeChild(div)
      })
    })
  })
  const lang = await page.evaluate(()=>document.querySelector('html').getAttribute('lang'))
  const html = await page.content();
  await browser.close();
  return { html, lang }
};


export default async (req, res) => {
  const url = "https://www.sueddeutsche.de/politik/trump-biden-brad-parscale-us-wahl-2020-1.4968933"
  const url2 = "https://www.welt.de/politik/ausland/article208498979/Tod-von-George-Floyd-Warum-ist-der-Polizist-nicht-im-Gefaengnis.html"
  const {html, lang} = await scrapeHTML(url)
  const extractor = require('unfluff')
  const data = lang != 'undefinded' ? extractor(html, 'de') : extractor(html, lang)
  const slug = new URL(url);
  data.slug = slug.pathname;
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ ...data }))
}
