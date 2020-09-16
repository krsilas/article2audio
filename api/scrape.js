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
  
  // const cookies = [{
  //   'name': 'euconsent',
  //   'value': 'BO0G9R8O0G9R8AGABBENDL-AAAAv0DIIRAgYwoAg4PCFkgATAGCAiAgAwAQAAQAAQAYAAgBhCAAggAEACQgAAAQAAABABAIAAAAQEAgAgACAAJAAIAACAAEAABBAAIgAAAAAAAAAAAQAAAAAAAEAAAAAAAAAAA'
  // }, {
  //   'name': 'spconsent',
  //   'value': 'eyJ2YWx1ZSI6dHJ1ZSwidXBkYXRlZF9hdCI6MTU5MDY2MjgzOH0='
  // }];
  // await page.setCookie(...cookies)

  await page.goto(req.body.url);
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
  const data = unfluff(html, lang || 'de')
  res.status(200).json({ ...data, slug: getSlug(req.body.url) })
};
