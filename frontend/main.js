import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from 'react'
import { fetchData } from './src/utils'
import { PollyClient } from './src/aws'

function Index() {
  const [url, setUrl] = useState("")
  const [article, setArticle] = useState()
  const [taskId, setTaskId] = useState()
  const [audioUrl, setAudioUrl] = useState()

  function handleSubmit(e){
    e.preventDefault();
    fetchArticle()
  }

  async function fetchArticle(){
    //Fetch content and metadata
    setArticle({title: 'Loading...'})
    const articleData = await fetchData('/api/scrape', { url })
    setArticle(articleData)

    //Start AWS Polly SynthesisTask
    const audioTask = await fetchData('/api/polly', {
      text: articleData.text,
      lang: articleData.lang
    })
    setTaskId(audioTask.TaskId)
  }

  useEffect(() => {
    const polling = setInterval(() => {
      taskId && PollyClient.getSpeechSynthesisTask({ TaskId: taskId }, (err, data) => {
        if (err) console.error(err, err.stack); 
        else {
          if (data.SynthesisTask.TaskStatus === 'completed') {
            setAudioUrl(data.SynthesisTask.OutputUri)
            clearInterval(polling)
          }
        }
      }) 
    }, 500)
    return () => clearInterval(polling)
  }, [taskId])

  return (
    <div className="mx-auto p-4 max-w-2xl">
      <h1 className="text-xl font-bold py-4">Blogpost2Audio</h1>
      <form onSubmit={handleSubmit} className="flex">
        <input className="px-3 py-2 border rounded-md shadow-sm border-gray-600 leading-5 text-sm" value={url} onChange={(e)=>setUrl(e.target.value)} type="url" placeholder="https://example.com" size="50" />
        <span className="ml-3 sm:ml-6 shadow-sm rounded-md">
        <button type="submit" className="inline-flex items-center px-4 py-2 text-sm border border-transparent leading-5 font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue focus:border-blue-800 active:bg-blue-800 transition duration-150 ease-in-out"> 
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg> 
          Load
        </button>
        </span>
      </form>
      
      { article && 
        <div className="mt-8">
          <h2 className="text-xl font-bold my-3">{article.title}</h2>
          { audioUrl 
            ? <audio src={audioUrl} className="my-3" controls /> 
            : <div className="flex items-center my-3 text-orange-800 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="inline-block mr-2 text-orange-600 transform rotate-180" width="16" height="16"><path fill="currentColor" d="M0 0h4v7H0z"><animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0s" dur="0.6s" repeatCount="indefinite"/></path><path fill="currentColor" d="M10 0h4v7h-4z"><animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.2s" dur="0.6s" repeatCount="indefinite"/></path><path fill="currentColor" d="M20 0h4v7h-4z"><animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.4s" dur="0.6s" repeatCount="indefinite"/></path></svg>
                Processing Audio...
              </div> }
          <p className="">{article.text}</p>
        </div>
    }
    </div>
  )
}

ReactDOM.render(<Index />, document.getElementById("app"))