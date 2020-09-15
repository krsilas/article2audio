import Head from 'next/head'
import { useEffect, useState } from 'react'
import { fetchData } from './utils'
import { Polly } from './aws'


export default function Home() {
  const [article, setArticle] = useState()
  const [audioUrl, setAudioUrl] = useState()
  const [url, setUrl] = useState("")

  async function handleSubmit(e){
    e.preventDefault();
    const article = await fetchData('http://localhost:3000/api/scrape', { url })
    const audio = await fetchData('http://localhost:3000/api/polly', {
      text: article.text,
      slug: article.slug
    })
    setArticle({...article, audioTaskId: audio.TaskId })
  }

  useEffect(() => {

    const polling = setInterval(() => {
        article && Polly.getSpeechSynthesisTask({ TaskId: article?.audioTaskId }, (err, data) => {
        if (err) console.error(err, err.stack); 
        else {
          if (data.SynthesisTask.TaskStatus === 'completed') {
            setAudioUrl(data.SynthesisTask.OutputUri)
            clearInterval(polling)
          } else console.log(data.SynthesisTask.TaskStatus)
        }
      }) 
    }, 10000)
    return () => clearInterval(polling)
  }, [article])

  
  

  return (
    <div className="container">
      <Head>
        <title>Dev4Cloud</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit}>
        <input value={url} onChange={(e)=>setUrl(e.target.value)} type="url" placeholder="https://example.com" size="50" />
        <button type="submit">Load</button>
      </form>
      
      { article && 
        <div>
        <h1>{article.title}</h1>
      { audioUrl ? <audio src={audioUrl} controls /> : <span>Loading...</span> }
        <pre>{JSON.stringify(audioUrl, null, 2)}</pre>
        <p>{article.text}</p>
        </div>
    }
    </div>
  )
}