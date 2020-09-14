import Head from 'next/head'

export default function Home({text, title, path}) {

  return (
    <div className="container">
      <Head>
        <title>Dev4Cloud</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <h1>{title}</h1>
    <audio src={path} controls />
    <p>{text}</p>
    </div>
  )
}

async function fetchData(url = '', data = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data)
  }) 
  return res.json()
}

export async function getStaticProps(context) {
  const url = "https://www.sueddeutsche.de/politik/trump-biden-brad-parscale-us-wahl-2020-1.4968933"
  const article = await fetchData('http://localhost:3000/api/scrape', { url })
  const audio = await fetchData('http://localhost:3000/api/polly', {
      text: article.text,
      slug: article.slug
  })

  return {
    props: {
      ...article,
      ...audio
    }, 
  }
}
