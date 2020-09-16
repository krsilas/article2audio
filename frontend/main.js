import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from 'react'
import { fetchData } from './src/utils'
import { PollyClient } from './src/aws'

function Index() {
  const [url, setUrl] = useState("")
  const [article, setArticle] = useState()
  const [audioUrl, setAudioUrl] = useState()

  async function fetchArticle(){
    const article = await fetchData('/api/scrape', { url })
    const audio = await fetchData('/api/polly', {
      text: article.text,
      lang: article.lang
    })
    setArticle({ ...article, audioTaskId: audio.TaskId })
  }

  function handleSubmit(e){
    e.preventDefault();
    fetchArticle()
  }

  useEffect(() => {
    const polling = setInterval(() => {
        article && PollyClient.getSpeechSynthesisTask({ TaskId: article?.audioTaskId }, (err, data) => {
        if (err) console.error(err, err.stack); 
        else {
          if (data.SynthesisTask.TaskStatus === 'completed') {
            setAudioUrl(data.SynthesisTask.OutputUri)
            clearInterval(polling)
          } else console.log(data.SynthesisTask.TaskStatus)
        }
      }) 
    }, 800)
    return () => clearInterval(polling)
  }, [article])

  return (
    <div className="mx-auto p-4 max-w-2xl">
      <h1 className="text-xl font-bold py-4">Blogpost2Audio</h1>
      <form onSubmit={handleSubmit} className="flex">
        <input className="px-3 py-2 border rounded-md shadow-sm border-gray-600 leading-5 text-sm" value={url} onChange={(e)=>setUrl(e.target.value)} type="url" placeholder="https://example.com" size="50" />
        <span class="sm:ml-3 shadow-sm rounded-md">
        <button type="submit" class="inline-flex items-center ml-3 px-4 py-2 text-sm border border-transparent leading-5 font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue focus:border-blue-800 active:bg-blue-800 transition duration-150 ease-in-out"> 
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg> 
          Load
        </button>
        </span>
      </form>
      
      { article && 
        <div>
        <h2 className="text-xl font-bold my-3">{article.title}</h2>
      { audioUrl ? <audio src={audioUrl} className="my-3" controls /> : <span>Loading...</span> }
        <p className="">{article.text}</p>
        </div>
    }
    </div>
  )
}

ReactDOM.render(<Index />, document.getElementById("app"))