import puppeteer from 'puppeteer'
import unfluff from 'unfluff'

function getSlug(url){
  const slug = new URL(url);
  return slug.pathname;
}

export async function scrapeHTML(req, res) {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  //Block 3rd-Party-JavaScript
  page.on("request", request => {
    const baseUrl = (url) => url.split('/')[2]
    if (request.resourceType() === "script" && baseUrl(request._url) !== baseUrl(req.body.url)) {
      request.abort()
    } else {
      request.continue()
    }
  })

  //Abort on 404
  //TODO: This is async and run after the other operations
  page.on("response", response => {
    if (response.url().match(req.body.url) && response.status() == 404) {
      //res.status(404).json({ error: 'Page not found!' })
    }
  })


  await page.goto(req.body.url);
  await page.evaluate(() => {
    //Ignore irrelevant content
    const ignore = ["[data-app-hidden]", "article section.clear-both ul", ".hidden", "figcaption", "footer"]
    ignore.forEach((element)=>{
      const nodes = document.querySelectorAll(element)
      nodes.forEach((div)=>{
        div.parentNode.removeChild(div)
      })
    })
  })
  const language = await page.evaluate(()=>document.querySelector('html').getAttribute('lang'))
  const html = await page.content();
  await browser.close();

  const data = unfluff(html, language || 'de')
  const slug = getSlug(req.body.url)

  res.status(200).json({ ...data, slug })
};
