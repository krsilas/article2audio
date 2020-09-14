import Head from 'next/head'
import { useState } from 'react'

export default function Home({text, title, path}) {

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

  async function getArticle(url) {
    const article = await fetchData('http://localhost:3000/api/scrape', { url })
    const audio = await fetchData('http://localhost:3000/api/polly', {
      text: article.text,
      slug: article.slug
    })
    setArticle({...article, ...audio})
  }

  
  const [article, setArticle] = useState()
  const [url, setUrl] = useState("")

  function handleSubmit(e){
    e.preventDefault();
    getArticle(url)
  }
  function handleInput(e){
    setUrl(e.target.value)
  }

  return (
    <div className="container">
      <Head>
        <title>Dev4Cloud</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit}>
        <input value={url} onChange={handleInput} type="url" placeholder="https://example.com" pattern="https://.*" size="30" />
        <button type="submit">Load</button>
      </form>
      
      { article && 
        <div>
        <h1>{article.title}</h1>
        <audio src={article.path} controls />
        <p>{article.text}</p>
        </div>
    }
    </div>
  )
}