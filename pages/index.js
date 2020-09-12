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

function fetchData(url = '', data = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      },
    body: JSON.stringify(data)
  }) 
}

export async function getStaticProps(context) {
  const article = fetchData('http://localhost:3000/api/scrape')
  const audio = fetchData('http://localhost:3000/api/polly', {
      text: article.text,
      slug: article.slug
  })

  return {
    props: {
      ...article,
      ...audio
    }, // will be passed to the page component as props
  }
}
